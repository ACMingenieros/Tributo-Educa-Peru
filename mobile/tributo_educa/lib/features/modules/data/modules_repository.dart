import 'package:cloud_firestore/cloud_firestore.dart';

import 'module_data.dart';

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
}
