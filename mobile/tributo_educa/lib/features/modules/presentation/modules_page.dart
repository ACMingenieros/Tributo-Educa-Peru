import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';
import '../data/module_data.dart';
import '../data/modules_repository.dart';
import 'lesson_page.dart';

class ModulesPage extends StatefulWidget {
  const ModulesPage({super.key, this.initialQuery = ''});

  final String initialQuery;

  @override
  State<ModulesPage> createState() => _ModulesPageState();
}

class _ModulesPageState extends State<ModulesPage> {
  late final TextEditingController _searchController;
  late final ModulesRepository _repository;
  late String _query;
  late Future<List<ModuleData>> _modulesFuture;

  @override
  void initState() {
    super.initState();
    _repository = ModulesRepository(FirebaseFirestore.instance);
    _modulesFuture = _repository.fetchModules();
    _query = widget.initialQuery;
    _searchController = TextEditingController(text: _query);
  }

  @override
  void didUpdateWidget(covariant ModulesPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.initialQuery != widget.initialQuery) {
      _query = widget.initialQuery;
      _searchController.text = _query;
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _retry() => setState(() => _modulesFuture = _repository.fetchModules());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Módulos educativos')),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
        children: [
          TextField(
            controller: _searchController,
            onChanged: (value) => setState(() => _query = value),
            decoration: InputDecoration(
              hintText: 'Buscar un tema',
              prefixIcon: const Icon(Icons.search_rounded),
              suffixIcon: _query.isEmpty
                  ? null
                  : IconButton(
                      tooltip: 'Limpiar búsqueda',
                      onPressed: () {
                        _searchController.clear();
                        setState(() => _query = '');
                      },
                      icon: const Icon(Icons.close_rounded),
                    ),
            ),
          ),
          const SizedBox(height: 18),
          Text(
            'Aprende sobre tu negocio',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 4),
          Text(
            'Contenido claro y organizado por temas.',
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          const SizedBox(height: 14),
          FutureBuilder<List<ModuleData>>(
            future: _modulesFuture,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const _LoadingModules();
              }
              if (snapshot.hasError) {
                return _LoadError(onRetry: _retry);
              }

              final query = _query.trim().toLowerCase();
              final modules = (snapshot.data ?? const <ModuleData>[])
                  .where(
                    (module) =>
                        module.title.toLowerCase().contains(query) ||
                        module.description.toLowerCase().contains(query),
                  )
                  .toList();
              if (modules.isEmpty) {
                return _EmptyModules(hasSearch: query.isNotEmpty);
              }

              return Column(
                children: [
                  for (var index = 0; index < modules.length; index++) ...[
                    _ModuleTile(
                      module: modules[index],
                      number: index + 1,
                      onTap: () => Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (context) => _ModuleDetailPage(
                            module: modules[index],
                            repository: _repository,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                  ],
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}

class _ModuleTile extends StatelessWidget {
  const _ModuleTile({
    required this.module,
    required this.number,
    required this.onTap,
  });

  final ModuleData module;
  final int number;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        leading: Container(
          width: 46,
          height: 46,
          decoration: BoxDecoration(
            color: AppColors.info,
            borderRadius: BorderRadius.circular(13),
          ),
          child: Icon(module.icon, color: AppColors.blue),
        ),
        title: Text(module.title.startsWith('Módulo ') ? module.title : 'Módulo $number: ${module.title}'),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4),
          child: Text(module.description),
        ),
        trailing: const Icon(
          Icons.chevron_right_rounded,
          color: AppColors.muted,
        ),
        onTap: onTap,
      ),
    );
  }
}

class _ModuleDetailPage extends StatefulWidget {
  const _ModuleDetailPage({required this.module, required this.repository});

  final ModuleData module;
  final ModulesRepository repository;

  @override
  State<_ModuleDetailPage> createState() => _ModuleDetailPageState();
}

class _ModuleDetailPageState extends State<_ModuleDetailPage> {
  late Future<List<SubmoduleData>> _submodulesFuture;

  @override
  void initState() {
    super.initState();
    _submodulesFuture = widget.repository.fetchSubmodules(widget.module.id);
  }

  void _retry() => setState(() {
    _submodulesFuture = widget.repository.fetchSubmodules(widget.module.id);
  });

  @override
  Widget build(BuildContext context) {
    final module = widget.module;
    return Scaffold(
      appBar: AppBar(title: Text(module.title)),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.navy,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                Icon(module.icon, color: AppColors.greenLight, size: 30),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Módulo educativo',
                        style: Theme.of(context).textTheme.labelSmall?.copyWith(
                          color: AppColors.greenLight,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        module.title,
                        style: Theme.of(context).textTheme.titleLarge
                            ?.copyWith(color: Colors.white),
                      ),
                      if (module.description.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(
                          module.description,
                          style: const TextStyle(color: Color(0xFFE1E9F5)),
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'Temas del módulo',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 10),
          FutureBuilder<List<SubmoduleData>>(
            future: _submodulesFuture,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const _LoadingModules();
              }
              if (snapshot.hasError) return _LoadError(onRetry: _retry);
              final submodules = snapshot.data ?? const <SubmoduleData>[];
              if (submodules.isEmpty) {
                return const _EmptyModules(
                  title: 'Pronto habrá contenido',
                  message: 'Los temas aparecerán aquí cuando se publiquen.',
                );
              }
              return Column(
                children: [
                  for (var index = 0; index < submodules.length; index++) ...[
                    Card(
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: AppColors.info,
                          foregroundColor: AppColors.blue,
                          child: Text('${index + 1}'),
                        ),
                        title: Text(submodules[index].title),
                        subtitle: submodules[index].description.isEmpty
                            ? null
                            : Text(submodules[index].description),
                        trailing: const Icon(Icons.chevron_right_rounded),
                        onTap: () => Navigator.of(context).push(
                          MaterialPageRoute<void>(
                            builder: (context) => LessonPage(
                              module: module,
                              submodule: submodules[index],
                              repository: widget.repository,
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                  ],
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}

class _LoadingModules extends StatelessWidget {
  const _LoadingModules();

  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.symmetric(vertical: 40),
      child: Center(
        child: CircularProgressIndicator(semanticsLabel: 'Cargando contenido'),
      ),
    );
  }
}

class _LoadError extends StatelessWidget {
  const _LoadError({required this.onRetry});

  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 16),
      child: Column(
        children: [
          const Icon(
            Icons.cloud_off_outlined,
            size: 40,
            color: AppColors.muted,
          ),
          const SizedBox(height: 10),
          const Text(
            'No se pudo cargar el contenido. Revisa tu conexión e inténtalo de nuevo.',
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 10),
          OutlinedButton.icon(
            onPressed: onRetry,
            icon: const Icon(Icons.refresh_rounded),
            label: const Text('Reintentar'),
          ),
        ],
      ),
    );
  }
}

class _EmptyModules extends StatelessWidget {
  const _EmptyModules({
    this.hasSearch = false,
    this.title = '',
    this.message = '',
  });

  final bool hasSearch;
  final String title;
  final String message;

  @override
  Widget build(BuildContext context) {
    final heading = title.isNotEmpty
        ? title
        : (hasSearch ? 'No encontramos ese tema' : 'Aún no hay módulos');
    final detail = message.isNotEmpty
        ? message
        : (hasSearch
              ? 'Prueba con otra palabra o revisa todos los módulos.'
              : 'Los módulos aparecerán aquí cuando se publiquen.');
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 42, horizontal: 20),
      child: Column(
        children: [
          Icon(
            hasSearch ? Icons.search_off_rounded : Icons.menu_book_outlined,
            size: 42,
            color: AppColors.muted,
          ),
          const SizedBox(height: 12),
          Text(heading, style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 5),
          Text(detail, textAlign: TextAlign.center),
        ],
      ),
    );
  }
}
