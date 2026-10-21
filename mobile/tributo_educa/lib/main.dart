import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'features/auth/presentation/auth_gate.dart';
import 'core/theme/app_theme.dart';
import 'firebase_options.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  final preferences = await SharedPreferences.getInstance();
  final rememberDevice = preferences.getBool('rememberDevice') ?? true;
  if (!rememberDevice && FirebaseAuth.instance.currentUser != null) {
    await FirebaseAuth.instance.signOut();
  }
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
      home: const AuthGate(),
    );
  }
}
