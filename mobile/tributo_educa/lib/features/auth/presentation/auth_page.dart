import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../core/theme/app_theme.dart';

enum _AuthMode { signIn, register, resetPassword }

class _ResetPasswordSteps extends StatelessWidget {
  const _ResetPasswordSteps();

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: AppColors.info.withValues(alpha: 0.55),
      borderRadius: BorderRadius.circular(14),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Es muy sencillo', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 12),
        const _ResetStep(
          number: '1',
          text: 'Escribe el correo asociado a tu cuenta.',
        ),
        const SizedBox(height: 10),
        const _ResetStep(
          number: '2',
          text: 'Abre el mensaje que te enviaremos.',
        ),
        const SizedBox(height: 10),
        const _ResetStep(
          number: '3',
          text: 'Sigue el enlace para elegir una contraseña nueva.',
        ),
      ],
    ),
  );
}

class _ResetStep extends StatelessWidget {
  const _ResetStep({required this.number, required this.text});

  final String number;
  final String text;

  @override
  Widget build(BuildContext context) => Row(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      CircleAvatar(
        radius: 12,
        backgroundColor: AppColors.green,
        child: Text(
          number,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 12,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      const SizedBox(width: 10),
      Expanded(
        child: Text(text, style: Theme.of(context).textTheme.bodyMedium),
      ),
    ],
  );
}

class AuthPage extends StatefulWidget {
  const AuthPage({super.key});

  @override
  State<AuthPage> createState() => _AuthPageState();
}

class _AuthPageState extends State<AuthPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmController = TextEditingController();
  _AuthMode _mode = _AuthMode.signIn;
  bool _rememberDevice = true;
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  bool _busy = false;
  String? _feedback;
  bool _feedbackIsError = false;

  bool get _isRegister => _mode == _AuthMode.register;
  bool get _isReset => _mode == _AuthMode.resetPassword;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmController.dispose();
    super.dispose();
  }

  void _changeMode(_AuthMode mode) {
    setState(() {
      _mode = mode;
      _feedback = null;
      _formKey.currentState?.reset();
    });
  }

  Future<void> _submit() async {
    FocusScope.of(context).unfocus();
    if (!(_formKey.currentState?.validate() ?? false)) return;
    setState(() {
      _busy = true;
      _feedback = null;
    });
    final email = _emailController.text.trim();
    try {
      if (_isReset) {
        await FirebaseAuth.instance.setLanguageCode('es');
        await FirebaseAuth.instance.sendPasswordResetEmail(email: email);
        if (mounted) {
          setState(() {
            _feedback = 'Si el correo está registrado, te enviaremos un mensaje con los pasos para crear una contraseña nueva. Revisa también la carpeta de correo no deseado.';
            _feedbackIsError = false;
          });
        }
        return;
      }

      if (_isRegister) {
        await FirebaseAuth.instance.createUserWithEmailAndPassword(
          email: email,
          password: _passwordController.text,
        );
      } else {
        await FirebaseAuth.instance.signInWithEmailAndPassword(
          email: email,
          password: _passwordController.text,
        );
      }
      final preferences = await SharedPreferences.getInstance();
      await preferences.setBool('rememberDevice', _rememberDevice);
    } on FirebaseAuthException catch (error) {
      if (mounted) {
        setState(() {
          _feedback = _messageFor(error.code);
          _feedbackIsError = true;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _feedback = 'No se pudo completar la solicitud. Revisa tu conexión e inténtalo otra vez.';
          _feedbackIsError = true;
        });
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  String _messageFor(String code) => switch (code) {
    'invalid-email' => 'Escribe un correo electrónico válido.',
    'user-disabled' =>
      'Esta cuenta no está habilitada. Contacta al administrador.',
    'user-not-found' ||
    'wrong-password' ||
    'invalid-credential' => 'Correo o contraseña incorrectos.',
    'email-already-in-use' =>
      'Ya existe una cuenta con ese correo. Inicia sesión.',
    'weak-password' => 'La contraseña debe tener al menos 6 caracteres.',
    'operation-not-allowed' =>
      'Falta habilitar Correo/contraseña en Firebase Authentication.',
    'too-many-requests' =>
      'Hubo varios intentos. Espera un momento y vuelve a probar.',
    'network-request-failed' =>
      'No hay conexión. Revisa tu internet e inténtalo otra vez.',
    'expired-action-code' =>
      'Este enlace ya venció. Solicita uno nuevo desde la aplicación.',
    'invalid-action-code' =>
      'Este enlace ya no es válido. Solicita uno nuevo desde la aplicación.',
    _ => 'No se pudo completar la solicitud. Inténtalo de nuevo.',
  };

  @override
  Widget build(BuildContext context) {
    final title = _isReset
        ? 'Crea una contraseña nueva'
        : _isRegister
        ? 'Crea tu cuenta'
        : 'Qué bueno verte';
    final subtitle = _isReset
        ? 'Te enviaremos un enlace seguro a tu correo para que puedas volver a entrar.'
        : _isRegister
        ? 'Regístrate para aprender a tu ritmo.'
        : 'Inicia sesión para continuar aprendiendo.';

    return Scaffold(
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) => Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 440),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Center(
                      child: Image.asset(
                        'assets/images/tributo_educa_logo.png',
                        width: 92,
                        height: 92,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'TRIBUTO EDUCA PERÚ',
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.labelSmall?.copyWith(
                        color: AppColors.green,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.2,
                      ),
                    ),
                    const SizedBox(height: 24),
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(22),
                        child: Form(
                          key: _formKey,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              Text(
                                title,
                                style: Theme.of(context)
                                    .textTheme
                                    .headlineMedium,
                              ),
                              const SizedBox(height: 6),
                              Text(
                                subtitle,
                                style: Theme.of(context).textTheme.bodyMedium,
                              ),
                              const SizedBox(height: 24),
                              TextFormField(
                                controller: _emailController,
                                enabled: !_busy,
                                keyboardType: TextInputType.emailAddress,
                                textInputAction: _isReset
                                    ? TextInputAction.done
                                    : TextInputAction.next,
                                autofillHints: const [AutofillHints.email],
                                decoration: const InputDecoration(
                                  labelText: 'Correo electrónico',
                                  prefixIcon: Icon(Icons.email_outlined),
                                ),
                                validator: (value) {
                                  final email = value?.trim() ?? '';
                                  if (email.isEmpty || !email.contains('@')) {
                                    return 'Ingresa un correo válido.';
                                  }
                                  return null;
                                },
                              ),
                              if (_isReset) ...[
                                const SizedBox(height: 18),
                                _ResetPasswordSteps(),
                              ],
                              if (!_isReset) ...[
                                const SizedBox(height: 14),
                                TextFormField(
                                  controller: _passwordController,
                                  enabled: !_busy,
                                  obscureText: _obscurePassword,
                                  textInputAction: _isRegister
                                      ? TextInputAction.next
                                      : TextInputAction.done,
                                  autofillHints: _isRegister
                                      ? const [AutofillHints.newPassword]
                                      : const [AutofillHints.password],
                                  decoration: InputDecoration(
                                    labelText: 'Contraseña',
                                    prefixIcon: const Icon(
                                      Icons.lock_outline_rounded,
                                    ),
                                    suffixIcon: IconButton(
                                      tooltip: _obscurePassword
                                          ? 'Mostrar contraseña'
                                          : 'Ocultar contraseña',
                                      onPressed: () => setState(
                                        () => _obscurePassword =
                                            !_obscurePassword,
                                      ),
                                      icon: Icon(
                                        _obscurePassword
                                            ? Icons.visibility_outlined
                                            : Icons.visibility_off_outlined,
                                      ),
                                    ),
                                  ),
                                  validator: (value) {
                                    if ((value ?? '').length < 6) {
                                      return 'Usa al menos 6 caracteres.';
                                    }
                                    return null;
                                  },
                                ),
                              ],
                              if (_isRegister) ...[
                                const SizedBox(height: 14),
                                TextFormField(
                                  controller: _confirmController,
                                  enabled: !_busy,
                                  obscureText: _obscureConfirmPassword,
                                  textInputAction: TextInputAction.done,
                                  decoration:
                                      const InputDecoration(
                                        labelText: 'Confirmar contraseña',
                                        prefixIcon: Icon(
                                          Icons.lock_reset_rounded,
                                        ),
                                      ).copyWith(
                                        suffixIcon: IconButton(
                                          tooltip: _obscureConfirmPassword
                                              ? 'Mostrar contraseña'
                                              : 'Ocultar contraseña',
                                          onPressed: () => setState(
                                            () => _obscureConfirmPassword =
                                                !_obscureConfirmPassword,
                                          ),
                                          icon: Icon(
                                            _obscureConfirmPassword
                                                ? Icons.visibility_outlined
                                                : Icons.visibility_off_outlined,
                                          ),
                                        ),
                                      ),
                                  validator: (value) =>
                                      value != _passwordController.text
                                      ? 'Las contraseñas no coinciden.'
                                      : null,
                                ),
                              ],
                              if (!_isRegister && !_isReset) ...[
                                const SizedBox(height: 4),
                                CheckboxListTile(
                                  contentPadding: EdgeInsets.zero,
                                  value: _rememberDevice,
                                  onChanged: _busy
                                      ? null
                                      : (value) => setState(
                                          () => _rememberDevice = value ?? true,
                                        ),
                                  title: const Text(
                                    'Recordar este dispositivo',
                                  ),
                                  controlAffinity:
                                      ListTileControlAffinity.leading,
                                  dense: true,
                                ),
                                Align(
                                  alignment: Alignment.centerRight,
                                  child: TextButton(
                                    onPressed: _busy
                                        ? null
                                        : () => _changeMode(
                                            _AuthMode.resetPassword,
                                          ),
                                    child: const Text('Olvidé mi contraseña'),
                                  ),
                                ),
                              ],
                              if (_isRegister) ...[
                                const SizedBox(height: 8),
                                CheckboxListTile(
                                  contentPadding: EdgeInsets.zero,
                                  value: _rememberDevice,
                                  onChanged: _busy
                                      ? null
                                      : (value) => setState(
                                          () => _rememberDevice = value ?? true,
                                        ),
                                  title: const Text(
                                    'Recordar este dispositivo',
                                  ),
                                  controlAffinity:
                                      ListTileControlAffinity.leading,
                                  dense: true,
                                ),
                              ],
                              if (_feedback != null) ...[
                                const SizedBox(height: 8),
                                Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: _feedbackIsError
                                        ? const Color(0xFFFFE9EC)
                                        : AppColors.greenLight,
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Text(
                                    _feedback!,
                                    style: TextStyle(
                                      color: _feedbackIsError
                                          ? const Color(0xFF9D1C32)
                                          : AppColors.textPrimary,
                                    ),
                                  ),
                                ),
                              ],
                              const SizedBox(height: 14),
                              FilledButton(
                                onPressed: _busy ? null : _submit,
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 13,
                                  ),
                                  child: _busy
                                      ? const SizedBox(
                                          width: 22,
                                          height: 22,
                                          child: CircularProgressIndicator(
                                            strokeWidth: 2,
                                            color: Colors.white,
                                          ),
                                        )
                                      : Text(
                                          _isReset
                                              ? 'Enviar instrucciones'
                                              : _isRegister
                                              ? 'Crear cuenta'
                                              : 'Iniciar sesión',
                                        ),
                                ),
                              ),
                              const SizedBox(height: 10),
                              if (_isReset)
                                TextButton(
                                  onPressed: _busy
                                      ? null
                                      : () => _changeMode(_AuthMode.signIn),
                                  child: const Text('Volver a iniciar sesión'),
                                )
                              else
                                TextButton(
                                  onPressed: _busy
                                      ? null
                                      : () => _changeMode(
                                          _isRegister
                                              ? _AuthMode.signIn
                                              : _AuthMode.register,
                                        ),
                                  child: Text(
                                    _isRegister
                                        ? 'Ya tengo una cuenta · Iniciar sesión'
                                        : '¿No tienes cuenta? Regístrate',
                                  ),
                                ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 18),
                    const Text(
                      'Contenido educativo. No reemplaza la asesoría de un profesional colegiado.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: AppColors.muted, fontSize: 12),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
