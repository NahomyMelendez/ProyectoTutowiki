# TutoWiki

TutoWiki es una plataforma web para la gestión de tutorías académicas desarrollada con **Next.js, React, TypeScript y MySQL**.

El sistema permite a los estudiantes registrarse, iniciar sesión, consultar tutorías disponibles, inscribirse en ellas y visualizar sus tutorías inscritas. Además, cuenta con un panel administrativo para gestionar materias, profesores, estudiantes, etiquetas y tutorías.

---

## Requisitos previos

Antes de ejecutar el proyecto, es necesario tener instalado:

* Node.js (versión 20 o superior)
* PNPM
* MySQL Server
* Git

Puedes verificar las instalaciones con:

```bash
node -v
pnpm -v
mysql --version
git --version
```

---

## Clonar el repositorio

```bash
git clone https://github.com/NahomyMelendez/ProyectoTutowiki.git

cd ProyectoTutowiki
```

---

## Instalar dependencias

```bash
pnpm install
```

---

## Configurar la base de datos

Crear un archivo llamado:

```text
apps/web/.env.local
```

y agregar las credenciales de tu base de datos:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=tutowiki
```

---

## Ejecutar el proyecto

Desde la carpeta raíz del proyecto ejecutar:

```bash
pnpm --filter web dev
```

O desde la carpeta `apps/web`:

```bash
pnpm dev
```

El proyecto estará disponible en:

```text
http://localhost:3000
```

---

## Usuarios de prueba

### Administrador

Correo:

```text
nahomymelendez@gmail.com
```

Contraseña:

```text
091125
```

### Estudiante

Registrar un nuevo usuario desde:

```text
http://localhost:3000/registro
```

---

## Funcionalidades implementadas

### Administrador

* Gestión de materias
* Gestión de profesores
* Gestión de estudiantes
* Gestión de etiquetas
* Gestión de tutorías

### Estudiante

* Registro público
* Inicio de sesión
* Inscripción a tutorías
* Visualización de tutorías inscritas
* Perfil del estudiante
* Cierre de sesión

---

## Integrantes

* Kristel Muñoz
* Nahomy Meléndez
* Karla Sibaja
* Emma Aguirre
* Joseph Torrentes
