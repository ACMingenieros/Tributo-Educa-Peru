import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';
import '../data/content_component_data.dart';
import '../data/module_data.dart';
import '../data/modules_repository.dart';

class LessonPage extends StatefulWidget {
  const LessonPage({
    super.key,
    required this.module,
    required this.submodule,
    required this.repository,
  });

  final ModuleData module;
  final SubmoduleData submodule;
  final ModulesRepository repository;

  @override
  State<LessonPage> createState() => _LessonPageState();
}

class _LessonPageState extends State<LessonPage> {
  late Future<List<ContentComponentData>> _future;

  @override
  void initState() {
    super.initState();
    _load();
  }

  void _load() {
    _future = widget.repository.fetchComponents(
      widget.module.id,
      widget.submodule.id,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.submodule.title)),
      body: FutureBuilder<List<ContentComponentData>>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(
                semanticsLabel: 'Cargando lección',
              ),
            );
          }
          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      'No se pudo cargar la lección. Revisa tu conexión.',
                    ),
                    const SizedBox(height: 12),
                    OutlinedButton.icon(
                      onPressed: () => setState(_load),
                      icon: const Icon(Icons.refresh_rounded),
                      label: const Text('Reintentar'),
                    ),
                  ],
                ),
              ),
            );
          }
          final blocks = snapshot.data ?? const <ContentComponentData>[];
          return ListView(
            padding: const EdgeInsets.fromLTRB(16, 18, 16, 32),
            children: [
              Text(
                widget.module.title,
                style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  color: AppColors.green,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                widget.submodule.title,
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              if (widget.submodule.description.isNotEmpty) ...[
                const SizedBox(height: 8),
                Text(widget.submodule.description),
              ],
              const SizedBox(height: 14),
              const _EducationNotice(),
              const SizedBox(height: 18),
              if (blocks.isEmpty)
                const Card(
                  child: Padding(
                    padding: EdgeInsets.all(18),
                    child: Text(
                      'Esta lección aún no tiene contenido publicado.',
                    ),
                  ),
                )
              else
                for (final block in blocks) ...[
                  LessonContentBlock(block: block),
                  const SizedBox(height: 12),
                ],
            ],
          );
        },
      ),
    );
  }
}

class _EducationNotice extends StatelessWidget {
  const _EducationNotice();

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(13),
    decoration: BoxDecoration(
      color: AppColors.info,
      borderRadius: BorderRadius.circular(12),
    ),
    child: const Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(Icons.info_outline_rounded, color: AppColors.blue, size: 20),
        SizedBox(width: 10),
        Expanded(
          child: Text(
            'Contenido educativo. No reemplaza asesoría tributaria, legal o contable profesional.',
          ),
        ),
      ],
    ),
  );
}

class LessonContentBlock extends StatelessWidget {
  const LessonContentBlock({super.key, required this.block});

  final ContentComponentData block;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(17),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (block.title.isNotEmpty) ...[
              Text(block.title, style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 9),
            ],
            switch (block.type) {
              'rich_text' ||
              'info_card' => SelectableText(block.string('body')),
              'checklist' => Column(
                children: [
                  for (final item in block.strings('items'))
                    Padding(
                      padding: const EdgeInsets.only(bottom: 9),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(
                            Icons.check_circle_outline_rounded,
                            size: 20,
                            color: AppColors.green,
                          ),
                          const SizedBox(width: 9),
                          Expanded(child: Text(item)),
                        ],
                      ),
                    ),
                ],
              ),
              'comparison_table' => _ComparisonTable(block: block),
              'faq' => Column(
                children: [
                  for (final item in block.faqs())
                    ExpansionTile(
                      tilePadding: EdgeInsets.zero,
                      title: Text(item['question']!),
                      children: [
                        Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: Text(item['answer']!),
                        ),
                      ],
                    ),
                ],
              ),
              'glossary' => Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    block.string('term'),
                    style: const TextStyle(fontWeight: FontWeight.w700),
                  ),
                  Text(block.string('definition')),
                ],
              ),
              'legal_notice' => Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(block.string('body')),
                  if (block.string('source').isNotEmpty) ...[
                    const SizedBox(height: 9),
                    SelectableText(
                      'Fuente: ${block.string('source')}',
                      style: Theme.of(context).textTheme.labelSmall,
                    ),
                  ],
                ],
              ),
              _ => const Text(
                'Este tipo de contenido requiere una versión más reciente de la aplicación.',
              ),
            },
          ],
        ),
      ),
    );
  }
}

class _ComparisonTable extends StatelessWidget {
  const _ComparisonTable({required this.block});

  final ContentComponentData block;

  @override
  Widget build(BuildContext context) {
    final columns = block.strings('columns');
    final rows = block.rows('rows');
    if (columns.isEmpty) return const Text('Tabla sin columnas.');
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: DataTable(
        columnSpacing: 18,
        columns: [
          for (final column in columns) DataColumn(label: Text(column)),
        ],
        rows: [
          for (final row in rows)
            DataRow(
              cells: [
                for (var index = 0; index < columns.length; index++)
                  DataCell(
                    SizedBox(
                      width: 155,
                      child: Text(index < row.length ? row[index] : ''),
                    ),
                  ),
              ],
            ),
        ],
      ),
    );
  }
}
