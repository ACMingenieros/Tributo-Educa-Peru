import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';

class ModulesPage extends StatefulWidget {
  const ModulesPage({super.key, this.initialQuery = ''});

  final String initialQuery;

  @override
  State<ModulesPage> createState() => _ModulesPageState();
}

class _ModulesPageState extends State<ModulesPage> {
  late final TextEditingController _searchController;
  late String _query;

  static const _modules = [
    _ModuleData(
      'Tributario',
      'SUNAT, regímenes y comprobantes',
      Icons.receipt_long_outlined,
    ),
    _ModuleData('Laboral', 'REMYPE, planillas y SUNAFIL', Icons.badge_outlined),
    _ModuleData(
      'Societario',
      'EIRL, SRL, SAC y SUNARP',
      Icons.business_outlined,
    ),
    _ModuleData(
      'Contable',
      'Finanzas, libros y conceptos clave',
      Icons.account_balance_wallet_outlined,
    ),
    _ModuleData(
      'Inmobiliario',
      'Arrendamientos comerciales',
      Icons.storefront_outlined,
    ),
    _ModuleData(
      'Propiedad intelectual',
      'Marcas y activos intangibles',
      Icons.lightbulb_outline_rounded,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _query = widget.initialQuery;
    _searchController = TextEditingController(text: _query);
  }

  @override
  void didUpdateWidget(covariant ModulesPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.initialQuery != widget.initialQuery) {
      _query = widget.initialQuery;
      _searchController.text = _query;
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _modules.where((module) {
      return module.title.toLowerCase().contains(_query.toLowerCase()) ||
          module.description.toLowerCase().contains(_query.toLowerCase());
    }).toList();

    return Scaffold(
      appBar: AppBar(title: const Text('Módulos educativos')),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
        children: [
          TextField(
            controller: _searchController,
            onChanged: (value) => setState(() => _query = value),
            decoration: InputDecoration(
              hintText: 'Buscar un tema',
              prefixIcon: const Icon(Icons.search_rounded),
              suffixIcon: _query.isEmpty
                  ? null
                  : IconButton(
                      tooltip: 'Limpiar búsqueda',
                      onPressed: () {
                        _searchController.clear();
                        setState(() => _query = '');
                      },
                      icon: const Icon(Icons.close_rounded),
                    ),
            ),
          ),
          const SizedBox(height: 18),
          Text(
            'Aprende sobre tu negocio',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 4),
          Text(
            'Contenido claro y organizado por temas.',
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          const SizedBox(height: 14),
          if (filtered.isEmpty)
            const _EmptyModules()
          else
            for (var index = 0; index < filtered.length; index++) ...[
              _ModuleTile(module: filtered[index], number: index + 1),
              const SizedBox(height: 10),
            ],
        ],
      ),
    );
  }
}

class _ModuleData {
  const _ModuleData(this.title, this.description, this.icon);

  final String title;
  final String description;
  final IconData icon;
}

class _ModuleTile extends StatelessWidget {
  const _ModuleTile({required this.module, required this.number});

  final _ModuleData module;
  final int number;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        leading: Container(
          width: 46,
          height: 46,
          decoration: BoxDecoration(
            color: AppColors.info,
            borderRadius: BorderRadius.circular(13),
          ),
          child: Icon(module.icon, color: AppColors.blue),
        ),
        title: Text('Módulo $number: ${module.title}'),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4),
          child: Text(module.description),
        ),
        trailing: const Icon(
          Icons.chevron_right_rounded,
          color: AppColors.muted,
        ),
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute<void>(
              builder: (context) => _ModuleDetailPage(module: module),
            ),
          );
        },
      ),
    );
  }
}

class _ModuleDetailPage extends StatelessWidget {
  const _ModuleDetailPage({required this.module});

  final _ModuleData module;

  @override
  Widget build(BuildContext context) {
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
                      const SizedBox(height: 4),
                      Text(
                        module.description,
                        style: const TextStyle(color: Color(0xFFE1E9F5)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Text('Contenido', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 10),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  const Icon(
                    Icons.menu_book_outlined,
                    size: 36,
                    color: AppColors.blue,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Estamos preparando este contenido',
                    style: Theme.of(context).textTheme.titleMedium,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Las guías aparecerán aquí cuando estén publicadas.',
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _EmptyModules extends StatelessWidget {
  const _EmptyModules();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 54, horizontal: 20),
      child: Column(
        children: [
          const Icon(
            Icons.search_off_rounded,
            size: 42,
            color: AppColors.muted,
          ),
          const SizedBox(height: 12),
          Text(
            'No encontramos ese tema',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 5),
          const Text('Prueba con otra palabra o revisa todos los módulos.'),
        ],
      ),
    );
  }
}
