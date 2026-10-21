import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';

class ToolsPage extends StatelessWidget {
  const ToolsPage({super.key, required this.onBrowseModules});

  final ValueChanged<String> onBrowseModules;

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Herramientas')),
    body: ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Text(
          'Recursos para orientarte',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 8),
        const Text(
          'Explora las guías disponibles y encuentra el tema que necesitas.',
        ),
        const SizedBox(height: 18),
        _ToolTile(
          icon: Icons.compare_arrows_rounded,
          title: 'Comparar opciones',
          description: 'Consulta guías y temas relacionados en los módulos.',
          onTap: () => onBrowseModules('régimen'),
        ),
        const SizedBox(height: 10),
        _ToolTile(
          icon: Icons.calculate_outlined,
          title: 'Impuestos y obligaciones',
          description: 'Busca contenidos sobre tributos y obligaciones.',
          onTap: () => onBrowseModules('tribut'),
        ),
        const SizedBox(height: 10),
        _ToolTile(
          icon: Icons.menu_book_outlined,
          title: 'Glosario y conceptos',
          description: 'Encuentra términos explicados en las guías publicadas.',
          onTap: () => onBrowseModules(''),
        ),
      ],
    ),
  );
}

class _ToolTile extends StatelessWidget {
  const _ToolTile({
    required this.icon,
    required this.title,
    required this.description,
    required this.onTap,
  });
  final IconData icon;
  final String title;
  final String description;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => Card(
    child: ListTile(
      leading: Icon(icon, color: AppColors.green),
      title: Text(title),
      subtitle: Text(description),
      trailing: const Icon(Icons.chevron_right_rounded),
      onTap: onTap,
    ),
  );
}
