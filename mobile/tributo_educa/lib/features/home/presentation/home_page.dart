import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';

class HomePage extends StatelessWidget {
  const HomePage({
    super.key,
    required this.onSearch,
    required this.onBrowseModules,
  });

  final ValueChanged<String> onSearch;
  final ValueChanged<String> onBrowseModules;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 16,
        title: const _Brand(),
        actions: [
          const Padding(
            padding: EdgeInsets.only(right: 16),
            child: CircleAvatar(
              radius: 17,
              backgroundColor: AppColors.info,
              child: Icon(
                Icons.person_rounded,
                size: 19,
                color: AppColors.blue,
              ),
            ),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
        children: [
          const _EducationalNotice(),
          const SizedBox(height: 18),
          _WelcomeCard(onSearch: onSearch),
          const SizedBox(height: 22),
          _SectionHeading(
            title: 'Explora los módulos',
            actionLabel: 'Ver todos',
            onPressed: () => onBrowseModules(''),
          ),
          const SizedBox(height: 12),
          _ModuleHighlights(onBrowseModules: onBrowseModules),
          const SizedBox(height: 22),
          const _SectionHeading(title: 'Aprende a tu ritmo'),
          const SizedBox(height: 12),
          const _LearningCard(),
        ],
      ),
    );
  }
}

class _Brand extends StatelessWidget {
  const _Brand();

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 34,
          height: 34,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10),
          ),
          padding: const EdgeInsets.all(2),
          child: Image.asset(
            'assets/images/tributo_educa_logo.png',
            semanticLabel: 'Logo de Tributo Educa Perú',
          ),
        ),
        const SizedBox(width: 9),
        Flexible(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Tributo Educa Perú',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: Theme.of(context).textTheme.titleMedium
                    ?.copyWith(fontSize: 15),
              ),
              Text(
                'Módulos educativos',
                style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  color: AppColors.green,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _EducationalNotice extends StatelessWidget {
  const _EducationalNotice();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 11),
      decoration: BoxDecoration(
        color: AppColors.info,
        borderRadius: BorderRadius.circular(12),
      ),
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.info_outline_rounded, size: 19, color: AppColors.blue),
          SizedBox(width: 9),
          Expanded(
            child: Text(
              'Contenido educativo. No reemplaza la asesoría de un profesional.',
              style: TextStyle(
                color: AppColors.textPrimary,
                fontSize: 13,
                height: 1.35,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _WelcomeCard extends StatelessWidget {
  const _WelcomeCard({required this.onSearch});

  final ValueChanged<String> onSearch;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.navy,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'INFORMACIÓN CLARA PARA TU NEGOCIO',
            style: Theme.of(context).textTheme.labelSmall?.copyWith(
              color: AppColors.greenLight,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.4,
            ),
          ),
          const SizedBox(height: 9),
          Text(
            'Formaliza tu negocio con más confianza',
            style: Theme.of(context).textTheme.headlineMedium
                ?.copyWith(color: Colors.white, fontSize: 25),
          ),
          const SizedBox(height: 9),
          const Text(
            'Encuentra guías sencillas sobre temas tributarios, laborales y societarios.',
            style: TextStyle(
              color: Color(0xFFE1E9F5),
              fontSize: 14,
              height: 1.45,
            ),
          ),
          const SizedBox(height: 18),
          Row(
            children: [
              Expanded(
                child: TextField(
                  textInputAction: TextInputAction.search,
                  onSubmitted: onSearch,
                  decoration: InputDecoration(
                    hintText: '¿Qué necesitas resolver?',
                    hintStyle: const TextStyle(
                      color: AppColors.muted,
                      fontSize: 13,
                    ),
                    prefixIcon: const Icon(Icons.search_rounded, size: 20),
                    contentPadding: const EdgeInsets.symmetric(vertical: 10),
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide.none,
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              SizedBox(
                height: 48,
                child: FilledButton(
                  onPressed: () => onSearch(''),
                  style: FilledButton.styleFrom(
                    backgroundColor: AppColors.green,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 15),
                  ),
                  child: const Text('Buscar'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _SectionHeading extends StatelessWidget {
  const _SectionHeading({
    required this.title,
    this.actionLabel,
    this.onPressed,
  });

  final String title;
  final String? actionLabel;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Text(title, style: Theme.of(context).textTheme.titleLarge),
        ),
        if (actionLabel != null)
          TextButton(onPressed: onPressed, child: Text(actionLabel!)),
      ],
    );
  }
}

class _ModuleHighlights extends StatelessWidget {
  const _ModuleHighlights({required this.onBrowseModules});

  final ValueChanged<String> onBrowseModules;

  static const _items = [
    ('Tributario', Icons.receipt_long_outlined, 'SUNAT y obligaciones'),
    ('Laboral', Icons.badge_outlined, 'REMYPE y trabajadores'),
    ('Societario', Icons.business_outlined, 'Formaliza tu empresa'),
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (final item in _items) ...[
          Card(
            child: ListTile(
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 14,
                vertical: 5,
              ),
              leading: Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: AppColors.info,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(item.$2, color: AppColors.blue),
              ),
              title: Text('Módulo ${_items.indexOf(item) + 1}: ${item.$1}'),
              subtitle: Text(item.$3),
              trailing: const Icon(Icons.chevron_right_rounded),
              onTap: () => onBrowseModules(item.$1),
            ),
          ),
          const SizedBox(height: 8),
        ],
      ],
    );
  }
}

class _LearningCard extends StatelessWidget {
  const _LearningCard();

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: AppColors.greenLight,
                borderRadius: BorderRadius.circular(14),
              ),
              child: const Icon(
                Icons.lightbulb_outline_rounded,
                color: AppColors.green,
              ),
            ),
            const SizedBox(width: 13),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Aprende paso a paso',
                    style: TextStyle(fontWeight: FontWeight.w700),
                  ),
                  SizedBox(height: 4),
                  Text('Guías prácticas para tomar mejores decisiones.'),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
