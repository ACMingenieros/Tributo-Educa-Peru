import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../features/home/presentation/home_page.dart';
import '../features/modules/presentation/modules_page.dart';
import '../features/modules/data/modules_repository.dart';
import '../features/tools/presentation/tools_page.dart';
import '../features/saved/presentation/saved_page.dart';
import '../features/profile/presentation/profile_page.dart';

class AppShell extends StatefulWidget {
  const AppShell({super.key, required this.user});

  final User user;

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int _selectedIndex = 0;
  String _moduleQuery = '';
  late final ModulesRepository _repository;
  final Set<String> _savedSubmoduleIds = {};

  @override
  void initState() {
    super.initState();
    _repository = ModulesRepository(FirebaseFirestore.instance);
    _loadSaved();
  }

  Future<void> _loadSaved() async {
    final preferences = await SharedPreferences.getInstance();
    if (!mounted) return;
    setState(
      () => _savedSubmoduleIds.addAll(
        preferences.getStringList('savedSubmoduleIds') ?? const [],
      ),
    );
  }

  void _openModules([String query = '']) {
    setState(() {
      _selectedIndex = 1;
      _moduleQuery = query;
    });
  }

  void _openSearch(String query) {
    setState(() {
      _selectedIndex = 1;
      _moduleQuery = query;
    });
  }

  void _toggleSaved(String id) {
    setState(() {
      if (!_savedSubmoduleIds.add(id)) _savedSubmoduleIds.remove(id);
    });
    SharedPreferences.getInstance().then(
      (preferences) => preferences.setStringList(
        'savedSubmoduleIds',
        _savedSubmoduleIds.toList(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final pages = <Widget>[
      HomePage(onSearch: _openSearch, onBrowseModules: _openModules),
      ModulesPage(
        initialQuery: _moduleQuery,
        repository: _repository,
        savedSubmoduleIds: _savedSubmoduleIds,
        onToggleSaved: _toggleSaved,
      ),
      ToolsPage(onBrowseModules: _openModules),
      SavedPage(
        repository: _repository,
        savedSubmoduleIds: _savedSubmoduleIds,
        onToggleSaved: _toggleSaved,
      ),
      ProfilePage(email: widget.user.email ?? '', onSignOut: _signOut),
    ];

    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: IndexedStack(index: _selectedIndex, children: pages),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (index) {
          setState(() {
            _selectedIndex = index;
            if (index != 1) _moduleQuery = '';
          });
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home_rounded),
            label: 'Inicio',
          ),
          NavigationDestination(
            icon: Icon(Icons.menu_book_outlined),
            selectedIcon: Icon(Icons.menu_book_rounded),
            label: 'Módulos',
          ),
          NavigationDestination(
            icon: Icon(Icons.build_outlined),
            selectedIcon: Icon(Icons.build_rounded),
            label: 'Herramientas',
          ),
          NavigationDestination(
            icon: Icon(Icons.bookmark_border_rounded),
            selectedIcon: Icon(Icons.bookmark_rounded),
            label: 'Guardados',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline_rounded),
            selectedIcon: Icon(Icons.person_rounded),
            label: 'Perfil',
          ),
        ],
      ),
    );
  }

  Future<void> _signOut() async {
    final preferences = await SharedPreferences.getInstance();
    await preferences.remove('rememberDevice');
    await FirebaseAuth.instance.signOut();
  }
}
