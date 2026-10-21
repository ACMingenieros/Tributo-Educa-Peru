import 'package:flutter/material.dart';

import '../../../features/modules/data/module_data.dart';
import '../../../features/modules/data/modules_repository.dart';
import '../../../features/modules/presentation/lesson_page.dart';

class SavedPage extends StatelessWidget {
  const SavedPage({
    super.key,
    required this.repository,
    required this.savedSubmoduleIds,
    required this.onToggleSaved,
  });

  final ModulesRepository repository;
  final Set<String> savedSubmoduleIds;
  final ValueChanged<String> onToggleSaved;

  void _openLesson(
    BuildContext context,
    ModuleData module,
    SubmoduleData submodule,
  ) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => _SavedLessonLoader(
          module: module,
          submodule: submodule,
          repository: repository,
          savedSubmoduleIds: savedSubmoduleIds,
          onToggleSaved: onToggleSaved,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Guardados')),
    body: FutureBuilder<List<ModuleData>>(
      future: repository.fetchModules(),
      builder: (context, modulesSnapshot) {
        if (modulesSnapshot.hasError) {
          return const Center(
            child: Text('No se pudieron cargar los temas guardados.'),
          );
        }
        if (!modulesSnapshot.hasData) {
          return const Center(child: CircularProgressIndicator());
        }
        return FutureBuilder<List<(ModuleData, SubmoduleData)>>(
          future: _loadSaved(
            repository,
            modulesSnapshot.data!,
            savedSubmoduleIds,
          ),
          builder: (context, snapshot) {
            if (snapshot.hasError) {
              return const Center(
                child: Text('No se pudieron cargar los temas guardados.'),
              );
            }
            if (!snapshot.hasData) {
              return const Center(child: CircularProgressIndicator());
            }
            final saved = snapshot.data!;
            if (saved.isEmpty) {
              return const Center(
                child: Padding(
                  padding: EdgeInsets.all(28),
                  child: Text(
                    'Aún no guardas temas. Abre una guía y toca el marcador para tenerla a mano.',
                    textAlign: TextAlign.center,
                  ),
                ),
              );
            }
            return ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: saved.length,
              separatorBuilder: (_, _) => const SizedBox(height: 8),
              itemBuilder: (context, index) {
                final (module, submodule) = saved[index];
                return Card(
                  child: ListTile(
                    title: Text(submodule.title),
                    subtitle: Text(module.title),
                    trailing: IconButton(
                      icon: const Icon(Icons.bookmark_remove_outlined),
                      onPressed: () => onToggleSaved(submodule.id),
                    ),
                    onTap: () => _openLesson(context, module, submodule),
                  ),
                );
              },
            );
          },
        );
      },
    ),
  );

  Future<List<(ModuleData, SubmoduleData)>> _loadSaved(
    ModulesRepository repository,
    List<ModuleData> modules,
    Set<String> savedIds,
  ) async {
    final result = <(ModuleData, SubmoduleData)>[];
    for (final module in modules) {
      for (final submodule in await repository.fetchSubmodules(module.id)) {
        if (savedIds.contains(submodule.id)) result.add((module, submodule));
      }
    }
    return result;
  }
}

class _SavedLessonLoader extends StatelessWidget {
  const _SavedLessonLoader({
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
          body: Center(child: Text('No se pudo abrir este tema.')),
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
