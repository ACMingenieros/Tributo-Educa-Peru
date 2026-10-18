import 'package:flutter/material.dart';

class ModuleData {
  const ModuleData({
    required this.id,
    required this.title,
    required this.description,
    required this.order,
    this.imageUrl,
  });

  final String id;
  final String title;
  final String description;
  final int order;
  final String? imageUrl;

  factory ModuleData.fromMap(String id, Map<String, dynamic> data) {
    return ModuleData(
      id: id,
      title: data['title'] as String? ?? 'Módulo sin título',
      description: data['description'] as String? ?? '',
      order: (data['order'] as num?)?.toInt() ?? 0,
      imageUrl: data['imageUrl'] as String?,
    );
  }

  IconData get icon => switch (id.toLowerCase()) {
    'tributario' => Icons.receipt_long_outlined,
    'laboral' => Icons.badge_outlined,
    'societario' => Icons.business_outlined,
    'contable' => Icons.account_balance_wallet_outlined,
    'inmobiliario' => Icons.storefront_outlined,
    _ => Icons.menu_book_outlined,
  };
}

class SubmoduleData {
  const SubmoduleData({
    required this.id,
    required this.title,
    required this.description,
    required this.order,
  });

  final String id;
  final String title;
  final String description;
  final int order;

  factory SubmoduleData.fromMap(String id, Map<String, dynamic> data) {
    return SubmoduleData(
      id: id,
      title: data['title'] as String? ?? 'Tema sin título',
      description: data['description'] as String? ?? '',
      order: (data['order'] as num?)?.toInt() ?? 0,
    );
  }
}
