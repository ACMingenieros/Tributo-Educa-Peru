import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key, required this.email, required this.onSignOut});

  final String email;
  final Future<void> Function() onSignOut;

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Perfil')),
    body: ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const CircleAvatar(
          radius: 36,
          backgroundColor: AppColors.info,
          child: Icon(
            Icons.person_outline_rounded,
            size: 36,
            color: AppColors.blue,
          ),
        ),
        const SizedBox(height: 14),
        Text(
          'Tributo Educa Perú',
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 4),
        Text(
          email,
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.bodyMedium,
        ),
        const SizedBox(height: 24),
        Card(
          child: ListTile(
            leading: const Icon(Icons.logout_rounded, color: AppColors.blue),
            title: const Text('Cerrar sesión'),
            subtitle: const Text('Saldrás de tu cuenta en este dispositivo.'),
            onTap: () => _confirmSignOut(context),
          ),
        ),
        const SizedBox(height: 10),
        const Card(
          child: ListTile(
            leading: Icon(Icons.verified_user_outlined, color: AppColors.green),
            title: Text('Uso educativo'),
            subtitle: Text(
              'El contenido no reemplaza la asesoría de un profesional colegiado.',
            ),
          ),
        ),
        const SizedBox(height: 10),
        const Card(
          child: ListTile(
            leading: Icon(Icons.info_outline_rounded, color: AppColors.blue),
            title: Text('Acerca de la aplicación'),
            subtitle: Text(
              'Información organizada para emprendedores y negocios en el Perú.',
            ),
          ),
        ),
      ],
    ),
  );

  Future<void> _confirmSignOut(BuildContext context) async {
    final shouldSignOut = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('¿Cerrar sesión?'),
        content: const Text(
          'Tendrás que iniciar sesión para volver a ver los módulos.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancelar'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Cerrar sesión'),
          ),
        ],
      ),
    );
    if (shouldSignOut == true) await onSignOut();
  }
}
