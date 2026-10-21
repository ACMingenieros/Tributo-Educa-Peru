import 'package:cloud_firestore/cloud_firestore.dart';

import 'module_data.dart';
import 'content_component_data.dart';

class ModulesRepository {
  ModulesRepository(this._firestore);

  final FirebaseFirestore _firestore;

  Future<List<ModuleData>> fetchModules() async {
    final snapshot = await _firestore
        .collection('modules')
        .where('status', isEqualTo: 'published')
        .where('isVisible', isEqualTo: true)
        .get();

    final modules =
        snapshot.docs
            .map((document) => ModuleData.fromMap(document.id, document.data()))
            .toList()
          ..sort((first, second) => first.order.compareTo(second.order));
    return modules;
  }

  Future<List<SubmoduleData>> fetchSubmodules(String moduleId) async {
    final snapshot = await _firestore
        .collection('modules')
        .doc(moduleId)
        .collection('submodules')
        .where('status', isEqualTo: 'published')
        .where('isVisible', isEqualTo: true)
        .get();

    final submodules =
        snapshot.docs
            .map(
              (document) => SubmoduleData.fromMap(document.id, document.data()),
            )
            .toList()
          ..sort((first, second) => first.order.compareTo(second.order));
    return submodules;
  }

  Future<List<ModuleSearchResult>> search(String query) async {
    final normalizedQuery = query.trim().toLowerCase();
    final modules = await fetchModules();
    final results = <ModuleSearchResult>[];

    for (final module in modules) {
      if (module.title.toLowerCase().contains(normalizedQuery) ||
          module.description.toLowerCase().contains(normalizedQuery)) {
        results.add(ModuleSearchResult(module: module));
      }
    }
    final submodulesByModule = await Future.wait(
      modules.map((module) async => (module, await fetchSubmodules(module.id))),
    );
    for (final (module, submodules) in submodulesByModule) {
      results.addAll(
        submodules
            .where(
              (submodule) =>
                  submodule.title.toLowerCase().contains(normalizedQuery) ||
                  submodule.description.toLowerCase().contains(normalizedQuery),
            )
            .map(
              (submodule) =>
                  ModuleSearchResult(module: module, submodule: submodule),
            ),
      );
    }
    return results;
  }

  Future<List<ContentComponentData>> fetchComponents(
    String moduleId,
    String submoduleId,
  ) async {
    final snapshot = await _firestore
        .collection('modules')
        .doc(moduleId)
        .collection('submodules')
        .doc(submoduleId)
        .collection('components')
        .where('status', isEqualTo: 'published')
        .where('isVisible', isEqualTo: true)
        .get();
    final components =
        snapshot.docs
            .map(
              (document) =>
                  ContentComponentData.fromMap(document.id, document.data()),
            )
            .toList()
          ..sort((first, second) => first.order.compareTo(second.order));
    return components;
  }
}

class ModuleSearchResult {
  const ModuleSearchResult({required this.module, this.submodule});

  final ModuleData module;
  final SubmoduleData? submodule;
}
