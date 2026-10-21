import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

import '../../../app/app_shell.dart';
import '../../../core/theme/app_theme.dart';
import 'auth_page.dart';

class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) => StreamBuilder<User?>(
    stream: FirebaseAuth.instance.authStateChanges(),
    builder: (context, snapshot) {
      if (snapshot.hasError) {
        return const _AuthStartupError();
      }
      if (snapshot.connectionState == ConnectionState.waiting) {
        return const _AuthLoading();
      }
      final user = snapshot.data;
      return user == null ? const AuthPage() : AppShell(user: user);
    },
  );
}

class _AuthLoading extends StatelessWidget {
  const _AuthLoading();

  @override
  Widget build(BuildContext context) => const Scaffold(
    body: Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Image(
            image: AssetImage('assets/images/tributo_educa_logo.png'),
            width: 112,
            height: 112,
          ),
          SizedBox(height: 20),
          CircularProgressIndicator(),
        ],
      ),
    ),
  );
}

class _AuthStartupError extends StatelessWidget {
  const _AuthStartupError();

  @override
  Widget build(BuildContext context) => Scaffold(
    body: Center(
      child: Padding(
        padding: const EdgeInsets.all(28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.cloud_off_rounded,
              size: 42,
              color: AppColors.blue,
            ),
            const SizedBox(height: 12),
            Text(
              'No pudimos comprobar tu sesión.',
              style: Theme.of(context).textTheme.titleMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            const Text('Revisa tu conexión y vuelve a abrir la aplicación.'),
          ],
        ),
      ),
    ),
  );
}
