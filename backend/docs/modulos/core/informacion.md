# Módulo CORE – Resumen Ejecutivo

## ¿Qué es el módulo CORE?

El módulo CORE es el núcleo de la plataforma empresarial. Se encarga de gestionar la identidad, el contexto y la seguridad del sistema, permitiendo que todos los demás módulos funcionen de forma integrada y segura.

---

## ¿Para qué sirve?

El CORE responde a tres preguntas clave:

* ¿Quién es el usuario?
* ¿En qué empresa está trabajando?
* ¿Qué acciones puede realizar?

Gracias a esto, el resto de módulos no necesitan preocuparse por la gestión de accesos o permisos.

---

## ¿Qué gestiona el CORE?

El módulo CORE gestiona:

* Empresas
* Usuarios
* Roles
* Permisos
* Acceso al sistema (autenticación y autorización)

No gestiona procesos de negocio como ventas, proyectos o vacaciones.

---

## Entidades principales

* **Empresa**: organización cliente del sistema. Todos los datos pertenecen a una empresa.
* **Usuario**: identidad que permite acceder a la plataforma.
* **Rol**: perfil del usuario dentro de la empresa.
* **Permiso**: acción concreta que un usuario puede realizar.

---

## Datos comunes

El CORE define campos comunes que utilizan todos los módulos:

* `empresa_id`
* `usuario_id`
* `created_at`
* `updated_at`

Estos campos garantizan coherencia, trazabilidad y análisis global.

---

## Relación con otros módulos

Todos los módulos dependen del CORE:

* RRHH vincula usuarios con empleados.
* ALM valida permisos para proyectos y tareas.
* CRM y ERP controlan el acceso a clientes y facturación.
* BPM utiliza roles para aprobaciones.
* BI analiza datos de toda la plataforma.

---

## Idea clave

El CORE no hace negocio, pero permite que todo el negocio funcione.

> Sin el módulo CORE, el resto de la plataforma no podría operar de forma segura ni coherente.
