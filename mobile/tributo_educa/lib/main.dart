import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';

import 'app/app_shell.dart';
import 'core/theme/app_theme.dart';
import 'firebase_options.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const TributoEducaApp());
}

class TributoEducaApp extends StatelessWidget {
  const TributoEducaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Tributo Educa Perú',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      home: const AppShell(),
    );
  }
}
