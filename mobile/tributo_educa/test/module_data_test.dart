import 'package:flutter_test/flutter_test.dart';
import 'package:tributo_educa/features/modules/data/module_data.dart';

void main() {
  group('ModuleData.fromMap', () {
    test('maps Firestore fields and normalizes numeric order', () {
      final module = ModuleData.fromMap('tributario', {
        'title': 'Tributario',
        'description': 'SUNAT y regímenes',
        'order': 2.0,
        'imageUrl': 'https://example.test/tributario.png',
      });

      expect(module.id, 'tributario');
      expect(module.title, 'Tributario');
      expect(module.order, 2);
      expect(module.imageUrl, 'https://example.test/tributario.png');
    });

    test('provides safe defaults for incomplete documents', () {
      final module = ModuleData.fromMap('custom', {});

      expect(module.title, 'Módulo sin título');
      expect(module.description, isEmpty);
      expect(module.order, 0);
    });
  });

  test('SubmoduleData maps the shared Firestore contract', () {
    final submodule = SubmoduleData.fromMap('regimenes', {
      'title': 'Regímenes Tributarios',
      'description': 'Nuevo RUS, RER, RMT y General',
      'order': 1,
    });

    expect(submodule.id, 'regimenes');
    expect(submodule.title, 'Regímenes Tributarios');
    expect(submodule.description, contains('RMT'));
    expect(submodule.order, 1);
  });
}
