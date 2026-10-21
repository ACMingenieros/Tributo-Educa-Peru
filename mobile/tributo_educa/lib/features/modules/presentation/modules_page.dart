import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';
import '../data/module_data.dart';
import '../data/modules_repository.dart';
import 'lesson_page.dart';

class ModulesPage extends StatefulWidget {
  const ModulesPage({
    super.key,
    this.initialQuery = '',
    required this.repository,
    required this.savedSubmoduleIds,
    required this.onToggleSaved,
  });

  final String initialQuery;
  final ModulesRepository repository;
  final Set<String> savedSubmoduleIds;
  final ValueChanged<String> onToggleSaved;

  @override
  State<ModulesPage> createState() => _ModulesPageState();
}

class _ModulesPageState extends State<ModulesPage> {
  late final TextEditingController _searchController;
  late final ModulesRepository _repository;
  late String _query;
  late Future<List<ModuleData>> _modulesFuture;
  late Future<List<ModuleSearchResult>> _searchFuture;

  @override
  void initState() {
    super.initState();
    _repository = widget.repository;
    _modulesFuture = _repository.fetchModules();
    _query = widget.initialQuery;
    _searchController = TextEditingController(text: _query);
    _searchFuture = _modulesFuture.then(
      (modules) =>
          modules.map((module) => ModuleSearchResult(module: module)).toList(),
    );
  }

  @override
  void didUpdateWidget(covariant ModulesPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.initialQuery != widget.initialQuery) {
      _query = widget.initialQuery;
      _searchController.text = _query;
      _startSearch(_query);
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _retry() {
    setState(() {
      _modulesFuture = _repository.fetchModules();
      _startSearch(_query);
    });
  }

  void _startSearch(String value) {
    _searchFuture = value.trim().isEmpty
        ? _modulesFuture.then(
            (modules) => modules
                .map((module) => ModuleSearchResult(module: module))
                .toList(),
          )
        : _repository.search(value);
  }

  void _updateQuery(String value) {
    setState(() => _query = value);
  }

  void _submitSearch(String value) {
    setState(() {
      _query = value;
      _startSearch(value);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Módulos educativos')),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
        children: [
          TextField(
            controller: _searchController,
            onChanged: _updateQuery,
            onSubmitted: _submitSearch,
            decoration: InputDecoration(
              hintText: 'Buscar un tema',
              prefixIcon: const Icon(Icons.search_rounded),
              suffixIcon: _query.trim().isEmpty
                  ? null
                  : IconButton(
                      tooltip: 'Buscar',
                      onPressed: () => _submitSearch(_searchController.text),
                      icon: const Icon(Icons.arrow_forward_rounded),
                    ),
            ),
          ),
          const SizedBox(height: 18),
          if (_query.isEmpty)
            Text(
              'Aprende sobre tu negocio',
              style: Theme.of(context).textTheme.titleLarge,
            ),
          if (_query.isEmpty) const SizedBox(height: 4),
          if (_query.isEmpty)
            Text(
              'Contenido claro y organizado por temas.',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          if (_query.isEmpty) const SizedBox(height: 14),
          FutureBuilder<List<ModuleSearchResult>>(
            future: _searchFuture,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const _LoadingModules();
              }
              if (snapshot.hasError) {
                return _LoadError(onRetry: _retry);
              }

              final results = snapshot.data ?? const <ModuleSearchResult>[];
              if (results.isEmpty) {
                return _EmptyModules(hasSearch: _query.trim().isNotEmpty);
              }

              return Column(
                children: [
                  for (final result in results) ...[
                    _SearchResultTile(
                      result: result,
                      onTap: () => _openResult(result),
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

  void _openResult(ModuleSearchResult result) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        settings: const RouteSettings(name: 'module-topics'),
        builder: (context) {
          if (result.submodule == null) {
            return _ModuleDetailPage(
              module: result.module,
              repository: _repository,
              savedSubmoduleIds: widget.savedSubmoduleIds,
              onToggleSaved: widget.onToggleSaved,
            );
          }
          return _OpenLessonLoader(
            module: result.module,
            submodule: result.submodule!,
            repository: _repository,
            savedSubmoduleIds: widget.savedSubmoduleIds,
            onToggleSaved: widget.onToggleSaved,
          );
        },
      ),
    );
  }
}

class _SearchResultTile extends StatelessWidget {
  const _SearchResultTile({required this.result, required this.onTap});
  final ModuleSearchResult result;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => Card(
    child: ListTile(
      leading: CircleAvatar(
        backgroundColor: AppColors.info,
        child: Icon(
          result.submodule == null
              ? result.module.icon
              : Icons.menu_book_outlined,
          color: AppColors.blue,
        ),
      ),
      title: Text(result.submodule?.title ?? result.module.title),
      subtitle: Text(
        result.submodule == null
            ? 'Módulo · ${result.module.description}'
            : result.module.title,
      ),
      trailing: const Icon(Icons.chevron_right_rounded),
      onTap: onTap,
    ),
  );
}

class _OpenLessonLoader extends StatelessWidget {
  const _OpenLessonLoader({
    required this.module,
    required this.submodule,
    required this.repository,
    required this.savedSubmoduleIds,
    required this.onToggleSaved,
  });
  final ModuleData module;
  final SubmoduleData submodule;
  final ModulesRepository repository;
  final Set<String> savedSubmoduleIds;
  final ValueChanged<String> onToggleSaved;
  @override
  Widget build(BuildContext context) => FutureBuilder<List<SubmoduleData>>(
    future: repository.fetchSubmodules(module.id),
    builder: (context, snapshot) {
      if (snapshot.hasError) {
        return const Scaffold(
          body: Center(child: Text('No se pudo cargar el tema.')),
        );
      }
      if (!snapshot.hasData) {
        return const Scaffold(body: Center(child: CircularProgressIndicator()));
      }
      return LessonPage(
        module: module,
        submodule: submodule,
        moduleSubmodules: snapshot.data!,
        repository: repository,
        savedSubmoduleIds: savedSubmoduleIds,
        onToggleSaved: onToggleSaved,
      );
    },
  );
}

class _ModuleDetailPage extends StatefulWidget {
  const _ModuleDetailPage({
    required this.module,
    required this.repository,
    required this.savedSubmoduleIds,
    required this.onToggleSaved,
  });

  final ModuleData module;
  final ModulesRepository repository;
  final Set<String> savedSubmoduleIds;
  final ValueChanged<String> onToggleSaved;

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
                            settings: const RouteSettings(
                              name: 'module-topics',
                            ),
                            builder: (context) => LessonPage(
                              module: module,
                              submodule: submodules[index],
                              moduleSubmodules: submodules,
                              repository: widget.repository,
                              savedSubmoduleIds: widget.savedSubmoduleIds,
                              onToggleSaved: widget.onToggleSaved,
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
