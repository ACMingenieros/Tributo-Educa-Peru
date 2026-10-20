import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tributo_educa/features/modules/data/content_component_data.dart';
import 'package:tributo_educa/features/modules/presentation/lesson_page.dart';

void main() {
  testWidgets('renders text, a checklist, and an unknown type safely', (
    tester,
  ) async {
    const blocks = [
      ContentComponentData(
        id: 'a',
        type: 'rich_text',
        title: 'Concepto',
        order: 0,
        data: {'body': 'Aprende a formalizarte.'},
      ),
      ContentComponentData(
        id: 'b',
        type: 'checklist',
        title: 'Pasos',
        order: 1,
        data: {
          'items': ['Revisa tu RUC'],
        },
      ),
      ContentComponentData(
        id: 'c',
        type: 'future_type',
        title: 'Futuro',
        order: 2,
        data: {},
      ),
    ];
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: SingleChildScrollView(
            child: Column(
              children: [
                for (final block in blocks) LessonContentBlock(block: block),
              ],
            ),
          ),
        ),
      ),
    );

    expect(find.text('Concepto'), findsOneWidget);
    expect(find.text('Aprende a formalizarte.'), findsOneWidget);
    expect(find.text('Revisa tu RUC'), findsOneWidget);
    expect(find.textContaining('versión más reciente'), findsOneWidget);
  });
}
