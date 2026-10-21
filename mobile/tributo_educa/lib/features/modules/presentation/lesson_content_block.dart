import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';
import '../data/content_component_data.dart';

class LessonContentBlock extends StatelessWidget {
  const LessonContentBlock({super.key, required this.block});

  final ContentComponentData block;

  @override
  Widget build(BuildContext context) {
    final title = block.title;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (title.isNotEmpty) ...[
              Text(title, style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 10),
            ],
            switch (block.type) {
              'rich_text' => SelectableText(block.string('body')),
              'image' => _ImageBlock(block: block),
              'document' => _DocumentBlock(block: block),
              'info_card' => _InfoCardBlock(block: block),
              'comparison_table' => _ComparisonTable(block: block),
              'faq' => _FaqBlock(block: block),
              'video' => _VideoBlock(block: block),
              'practical_case' => _PracticalCaseBlock(block: block),
              'exam' => _QuestionPreviewBlock(block: block, simulator: false),
              'checklist' => _ChecklistBlock(block: block),
              'glossary' => _GlossaryBlock(block: block),
              'simulator' => _QuestionPreviewBlock(
                block: block,
                simulator: true,
              ),
              'calculator' => _CalculatorBlock(block: block),
              'alert_calendar' => _CalendarBlock(block: block),
              'legal_notice' => _LegalNoticeBlock(block: block),
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

class _ImageBlock extends StatelessWidget {
  const _ImageBlock({required this.block});
  final ContentComponentData block;

  @override
  Widget build(BuildContext context) {
    final url = block.string('url');
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (url.isEmpty)
          const _MediaPlaceholder(
            icon: Icons.image_outlined,
            label: 'Imagen educativa',
          )
        else
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Image.network(
              url,
              width: double.infinity,
              fit: BoxFit.cover,
              errorBuilder: (_, _, _) => const _MediaPlaceholder(
                icon: Icons.broken_image_outlined,
                label: 'No se pudo cargar la imagen',
              ),
            ),
          ),
        if (block.string('altText').isNotEmpty) ...[
          const SizedBox(height: 7),
          Text(
            block.string('altText'),
            style: Theme.of(context).textTheme.labelSmall,
          ),
        ],
        if (block.string('caption').isNotEmpty) ...[
          const SizedBox(height: 5),
          Text(
            block.string('caption'),
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ],
      ],
    );
  }
}

class _MediaPlaceholder extends StatelessWidget {
  const _MediaPlaceholder({required this.icon, required this.label});
  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) => Container(
    width: double.infinity,
    height: 128,
    decoration: BoxDecoration(
      color: AppColors.background,
      borderRadius: BorderRadius.circular(12),
    ),
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(icon, color: AppColors.muted, size: 30),
        const SizedBox(height: 7),
        Text(label, style: Theme.of(context).textTheme.labelSmall),
      ],
    ),
  );
}

class _DocumentBlock extends StatelessWidget {
  const _DocumentBlock({required this.block});
  final ContentComponentData block;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(
      color: AppColors.background,
      borderRadius: BorderRadius.circular(12),
      border: Border.all(color: AppColors.border),
    ),
    child: Row(
      children: [
        Container(
          width: 42,
          height: 46,
          decoration: BoxDecoration(
            color: const Color(0xFFFFE9E9),
            borderRadius: BorderRadius.circular(9),
          ),
          child: const Icon(
            Icons.picture_as_pdf_outlined,
            color: Color(0xFFB83B48),
          ),
        ),
        const SizedBox(width: 11),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                block.string('fileName', fallback: 'Documento de apoyo'),
                style: Theme.of(context).textTheme.titleMedium,
              ),
              if (block.string('description').isNotEmpty) ...[
                const SizedBox(height: 3),
                Text(
                  block.string('description'),
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
            ],
          ),
        ),
        const Icon(Icons.download_outlined, color: AppColors.green),
      ],
    ),
  );
}

class _InfoCardBlock extends StatelessWidget {
  const _InfoCardBlock({required this.block});
  final ContentComponentData block;

  @override
  Widget build(BuildContext context) => Container(
    width: double.infinity,
    padding: const EdgeInsets.all(13),
    decoration: BoxDecoration(
      color: AppColors.info,
      borderRadius: BorderRadius.circular(12),
      border: const Border(left: BorderSide(color: AppColors.green, width: 3)),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (block.string('label').isNotEmpty) ...[
          Text(
            block.string('label').toUpperCase(),
            style: Theme.of(context).textTheme.labelSmall
                ?.copyWith(color: AppColors.green, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 5),
        ],
        Text(block.string('body')),
      ],
    ),
  );
}

class _ChecklistBlock extends StatelessWidget {
  const _ChecklistBlock({required this.block});
  final ContentComponentData block;

  @override
  Widget build(BuildContext context) => Column(
    children: [
      for (final item in block.strings('items'))
        Padding(
          padding: const EdgeInsets.only(bottom: 10),
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
  );
}

class _ComparisonTable extends StatelessWidget {
  const _ComparisonTable({required this.block});
  final ContentComponentData block;

  @override
  Widget build(BuildContext context) {
    final columns = block.strings('columns');
    final rows = block.rows('rows');
    if (columns.isEmpty) {
      return const Text('Agrega columnas para mostrar la comparación.');
    }
    final tableRows = <List<String>>[
      columns,
      for (final row in rows)
        List<String>.generate(
          columns.length,
          (index) => index < row.length ? row[index] : '',
        ),
    ];

    return LayoutBuilder(
      builder: (context, constraints) {
        final minimumColumnWidth = columns.length <= 2 ? 150.0 : 132.0;
        final tableWidth =
            (constraints.maxWidth / columns.length).clamp(
              minimumColumnWidth,
              240.0,
            ) *
            columns.length;
        return SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: SizedBox(
            width: tableWidth,
            child: Column(
              children: [
                for (var rowIndex = 0; rowIndex < tableRows.length; rowIndex++)
                  IntrinsicHeight(
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        for (final cell in tableRows[rowIndex])
                          Expanded(
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 12,
                              ),
                              decoration: BoxDecoration(
                                color: rowIndex == 0
                                    ? AppColors.background
                                    : AppColors.surface,
                                border: Border(
                                  right: const BorderSide(
                                    color: AppColors.border,
                                  ),
                                  bottom: const BorderSide(
                                    color: AppColors.border,
                                  ),
                                  top: rowIndex == 0
                                      ? const BorderSide(
                                          color: AppColors.border,
                                        )
                                      : BorderSide.none,
                                  left: const BorderSide(
                                    color: AppColors.border,
                                  ),
                                ),
                              ),
                              child: Align(
                                alignment: Alignment.topLeft,
                                child: Text(
                                  cell,
                                  softWrap: true,
                                  style: rowIndex == 0
                                      ? Theme.of(context).textTheme.titleSmall
                                            ?.copyWith(
                                              fontWeight: FontWeight.w700,
                                            )
                                      : Theme.of(context).textTheme.bodyMedium,
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _FaqBlock extends StatelessWidget {
  const _FaqBlock({required this.block});
  final ContentComponentData block;

  @override
  Widget build(BuildContext context) => Column(
    children: [
      for (final item in block.faqs())
        ExpansionTile(
          tilePadding: EdgeInsets.zero,
          childrenPadding: const EdgeInsets.only(bottom: 12),
          title: Text(
            item['question']!,
            style: Theme.of(context).textTheme.titleMedium,
          ),
          children: [
            Align(
              alignment: Alignment.centerLeft,
              child: Text(item['answer']!),
            ),
          ],
        ),
    ],
  );
}

class _VideoBlock extends StatelessWidget {
  const _VideoBlock({required this.block});
  final ContentComponentData block;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Container(
        height: 150,
        width: double.infinity,
        decoration: BoxDecoration(
          color: AppColors.navy,
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.play_circle_outline_rounded,
              color: Colors.white,
              size: 48,
            ),
            SizedBox(height: 5),
            Text(
              'VIDEO EDUCATIVO',
              style: TextStyle(
                color: Colors.white70,
                fontSize: 10,
                letterSpacing: 1,
              ),
            ),
          ],
        ),
      ),
      if (block.string('caption').isNotEmpty) ...[
        const SizedBox(height: 8),
        Text(
          block.string('caption'),
          style: Theme.of(context).textTheme.bodyMedium,
        ),
      ],
    ],
  );
}

class _PracticalCaseBlock extends StatelessWidget {
  const _PracticalCaseBlock({required this.block});
  final ContentComponentData block;

  @override
  Widget build(BuildContext context) {
    const sections = [
      ('context', 'EL CASO'),
      ('facts', 'DATOS CLAVE'),
      ('analysis', 'ANÁLISIS'),
      ('conclusion', 'CONCLUSIÓN'),
    ];
    return Column(
      children: [
        for (final (key, label) in sections)
          if (block.string(key).isNotEmpty)
            Container(
              width: double.infinity,
              margin: const EdgeInsets.only(bottom: 9),
              padding: const EdgeInsets.all(11),
              decoration: BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      color: AppColors.green,
                      fontWeight: FontWeight.w800,
                      letterSpacing: .6,
                    ),
                  ),
                  const SizedBox(height: 5),
                  Text(block.string(key)),
                ],
              ),
            ),
      ],
    );
  }
}

class _QuestionPreviewBlock extends StatelessWidget {
  const _QuestionPreviewBlock({required this.block, required this.simulator});
  final ContentComponentData block;
  final bool simulator;

  @override
  Widget build(BuildContext context) {
    final questions = _records(block.data['questions']);
    final instruction = block.string(
      simulator ? 'introduction' : 'instructions',
    );
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (instruction.isNotEmpty) Text(instruction),
        for (var i = 0; i < questions.length && i < 3; i++)
          _QuestionCard(question: questions[i], number: i + 1),
        if (questions.isEmpty) _QuestionCard(question: const {}, number: 1),
        const _ComingSoonNote(),
      ],
    );
  }
}

class _QuestionCard extends StatelessWidget {
  const _QuestionCard({required this.question, required this.number});
  final Map<String, dynamic> question;
  final int number;

  @override
  Widget build(BuildContext context) {
    final prompt = _text(question, [
      'question',
      'prompt',
      'text',
    ], 'La pregunta aparecerá aquí.');
    final options = _list(question['options'] ?? question['alternatives']);
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 10),
      padding: const EdgeInsets.all(11),
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.border),
        borderRadius: BorderRadius.circular(11),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '$number. $prompt',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          for (final option in options.take(4))
            ListTile(
              dense: true,
              contentPadding: EdgeInsets.zero,
              minLeadingWidth: 24,
              leading: const Icon(
                Icons.radio_button_unchecked_rounded,
                size: 19,
                color: AppColors.muted,
              ),
              title: Text(
                option is Map
                    ? _text(option.cast<String, dynamic>(), [
                        'text',
                        'label',
                        'value',
                      ], '')
                    : '$option',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
            ),
          if (options.isEmpty)
            const ListTile(
              dense: true,
              contentPadding: EdgeInsets.zero,
              minLeadingWidth: 24,
              leading: Icon(
                Icons.radio_button_unchecked_rounded,
                size: 19,
                color: AppColors.muted,
              ),
              title: Text('Alternativa de respuesta'),
            ),
        ],
      ),
    );
  }
}

class _CalculatorBlock extends StatelessWidget {
  const _CalculatorBlock({required this.block});
  final ContentComponentData block;

  @override
  Widget build(BuildContext context) {
    final inputs = _records(block.data['inputs']);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (block.string('introduction').isNotEmpty)
          Text(block.string('introduction')),
        for (var i = 0; i < inputs.length && i < 5; i++)
          Padding(
            padding: const EdgeInsets.only(top: 9),
            child: InputDecorator(
              decoration: InputDecoration(
                labelText: _text(inputs[i], ['label', 'name'], 'Dato ${i + 1}'),
              ),
              child: Text(
                _text(inputs[i], ['placeholder', 'unit'], 'Escribe un valor'),
              ),
            ),
          ),
        if (inputs.isEmpty)
          const Padding(
            padding: EdgeInsets.only(top: 9),
            child: InputDecorator(
              decoration: InputDecoration(labelText: 'Dato de entrada'),
              child: Text('Escribe un valor'),
            ),
          ),
        if (block.string('formulaDescription').isNotEmpty) ...[
          const SizedBox(height: 10),
          Text(
            block.string('formulaDescription'),
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ],
        const _ComingSoonNote(),
      ],
    );
  }
}

class _CalendarBlock extends StatelessWidget {
  const _CalendarBlock({required this.block});
  final ContentComponentData block;

  @override
  Widget build(BuildContext context) {
    final schedule = _records(block.data['schedule']);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (block.string('description').isNotEmpty)
          Text(block.string('description')),
        for (final item in schedule.take(8))
          Container(
            margin: const EdgeInsets.only(top: 9),
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(7),
                  decoration: BoxDecoration(
                    color: AppColors.greenLight,
                    borderRadius: BorderRadius.circular(7),
                  ),
                  child: Text(
                    _text(item, ['date', 'dueDate', 'day'], 'FECHA'),
                    style: const TextStyle(
                      color: AppColors.green,
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
                const SizedBox(width: 9),
                Expanded(
                  child: Text(
                    _text(item, ['title', 'description', 'name'], 'Obligación'),
                  ),
                ),
              ],
            ),
          ),
        if (schedule.isEmpty) const _CalendarEntryPlaceholder(),
        if (block.string('source').isNotEmpty) ...[
          const SizedBox(height: 9),
          Text(
            'Fuente: ${block.string('source')}',
            style: Theme.of(context).textTheme.labelSmall,
          ),
        ],
      ],
    );
  }
}

class _CalendarEntryPlaceholder extends StatelessWidget {
  const _CalendarEntryPlaceholder();

  @override
  Widget build(BuildContext context) => Container(
    margin: const EdgeInsets.only(top: 9),
    padding: const EdgeInsets.all(10),
    decoration: BoxDecoration(
      color: AppColors.background,
      borderRadius: BorderRadius.circular(10),
    ),
    child: const Row(
      children: [
        Icon(Icons.event_outlined, color: AppColors.green),
        SizedBox(width: 9),
        Text('Las fechas aparecerán aquí.'),
      ],
    ),
  );
}

class _GlossaryBlock extends StatelessWidget {
  const _GlossaryBlock({required this.block});
  final ContentComponentData block;

  @override
  Widget build(BuildContext context) => Container(
    width: double.infinity,
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(
      color: AppColors.background,
      borderRadius: BorderRadius.circular(10),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          block.string('term'),
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 4),
        Text(block.string('definition')),
        if (block.string('source').isNotEmpty) ...[
          const SizedBox(height: 7),
          Text(
            'Fuente: ${block.string('source')}',
            style: Theme.of(context).textTheme.labelSmall,
          ),
        ],
      ],
    ),
  );
}

class _LegalNoticeBlock extends StatelessWidget {
  const _LegalNoticeBlock({required this.block});
  final ContentComponentData block;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(
      color: AppColors.info,
      borderRadius: BorderRadius.circular(11),
    ),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Icon(Icons.info_outline_rounded, size: 19, color: AppColors.blue),
        const SizedBox(width: 9),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(block.string('body')),
              if (block.string('source').isNotEmpty) ...[
                const SizedBox(height: 8),
                Text(
                  'Fuente: ${block.string('source')}',
                  style: Theme.of(context).textTheme.labelSmall,
                ),
              ],
            ],
          ),
        ),
      ],
    ),
  );
}

class _ComingSoonNote extends StatelessWidget {
  const _ComingSoonNote();

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(top: 10),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Icon(
          Icons.info_outline_rounded,
          size: 15,
          color: AppColors.muted,
        ),
        const SizedBox(width: 6),
        Expanded(
          child: Text(
            'Vista demostrativa. La interacción estará disponible próximamente.',
            style: Theme.of(context).textTheme.labelSmall,
          ),
        ),
      ],
    ),
  );
}

List<Map<String, dynamic>> _records(dynamic value) {
  final candidates = value is Map
      ? value['items'] ??
            value['questions'] ??
            value['events'] ??
            value['dates'] ??
            value['inputs']
      : value;
  if (candidates is! List) return const [];
  return candidates
      .whereType<Map>()
      .map((item) => item.map((key, value) => MapEntry('$key', value)))
      .toList();
}

List<dynamic> _list(dynamic value) {
  if (value is List) return value;
  if (value is Map) {
    final nested = value['options'] ?? value['alternatives'] ?? value['items'];
    return nested is List ? nested : const [];
  }
  return const [];
}

String _text(Map<String, dynamic> values, List<String> keys, String fallback) {
  for (final key in keys) {
    final value = values[key];
    if (value is String && value.isNotEmpty) return value;
  }
  return fallback;
}
