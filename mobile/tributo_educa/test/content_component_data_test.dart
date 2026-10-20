import 'package:flutter_test/flutter_test.dart';
import 'package:tributo_educa/features/modules/data/content_component_data.dart';

void main() {
  test('maps Firestore block data and tolerates malformed optional values', () {
    final block = ContentComponentData.fromMap('id-1', {
      'type': 'comparison_table',
      'title': 'Regímenes',
      'order': 2.0,
      'data': {
        'columns': ['Régimen', 'Detalle'],
        'rows': [
          {
            'cells': ['RMT', 'MYPE'],
          },
          {
            'cells': ['General', 'Todos'],
          },
        ],
      },
    });
    expect(block.order, 2);
    expect(block.strings('columns'), ['Régimen', 'Detalle']);
    expect(block.rows('rows').first, ['RMT', 'MYPE']);
    expect(
      ContentComponentData.fromMap('id-2', {'data': 'invalid'}).data,
      isEmpty,
    );
  });
}
