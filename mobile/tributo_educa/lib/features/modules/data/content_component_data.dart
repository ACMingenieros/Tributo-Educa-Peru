class ContentComponentData {
  const ContentComponentData({
    required this.id,
    required this.type,
    required this.title,
    required this.order,
    required this.data,
  });

  final String id;
  final String type;
  final String title;
  final int order;
  final Map<String, dynamic> data;

  factory ContentComponentData.fromMap(String id, Map<String, dynamic> raw) {
    final content = raw['data'];
    return ContentComponentData(
      id: id,
      type: raw['type'] is String ? raw['type'] as String : '',
      title: raw['title'] is String ? raw['title'] as String : '',
      order: (raw['order'] as num?)?.toInt() ?? 0,
      data: content is Map ? Map<String, dynamic>.from(content) : {},
    );
  }

  String string(String key) => data[key] is String ? data[key] as String : '';

  List<String> strings(String key) {
    final value = data[key];
    return value is List ? value.whereType<String>().toList() : const [];
  }

  List<List<String>> rows(String key) {
    final value = data[key];
    if (value is! List) return const [];
    return value
        .map((row) {
          final cells = row is Map ? row['cells'] : row;
          return cells is List
              ? cells.whereType<String>().toList()
              : <String>[];
        })
        .where((row) => row.isNotEmpty)
        .toList();
  }

  List<Map<String, String>> faqs() {
    final value = data['items'];
    if (value is! List) return const [];
    return value
        .whereType<Map>()
        .map(
          (item) => {
            'question': item['question'] is String
                ? item['question'] as String
                : '',
            'answer': item['answer'] is String ? item['answer'] as String : '',
          },
        )
        .where((item) => item['question']!.isNotEmpty)
        .toList();
  }
}
