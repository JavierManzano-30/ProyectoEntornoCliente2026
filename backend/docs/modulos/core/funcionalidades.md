# Módulo CORE – Documento Extenso

## 1. Introducción

El módulo CORE constituye el núcleo fundamental de la plataforma empresarial. Su función principal es proporcionar un marco común de identidad, contexto y seguridad que permita el funcionamiento coherente e integrado de todos los módulos del sistema.

A diferencia de otros módulos orientados al negocio (RRHH, CRM, ERP, etc.), el CORE no implementa procesos empresariales específicos, sino que define las bases estructurales sobre las que dichos procesos pueden ejecutarse de forma segura y organizada.

---

## 2. Objetivo del módulo CORE

El objetivo principal del módulo CORE es responder de forma centralizada a las siguientes cuestiones:

* ¿Quién es el usuario que accede al sistema?
* ¿A qué empresa pertenece?
* ¿Qué rol ocupa dentro de dicha empresa?
* ¿Qué acciones está autorizado a realizar?

De esta manera, el CORE actúa como punto único de referencia para la gestión de identidad y permisos en toda la plataforma.

---

## 3. Responsabilidades principales

Las responsabilidades del módulo CORE incluyen:

* Gestión de empresas dentro de una arquitectura multiempresa.
* Gestión de usuarios y credenciales de acceso.
* Definición y asignación de roles.
* Definición y validación de permisos.
* Control de autenticación (verificación de identidad).
* Control de autorización (validación de acciones permitidas).
* Provisión de datos comunes al resto de módulos.

Todos los módulos del sistema dependen del CORE para validar el acceso y las acciones de los usuarios.

---

## 4. Entidades principales del CORE

### 4.1 Empresa

La entidad Empresa representa a una organización cliente de la plataforma. El sistema está diseñado para soportar múltiples empresas de forma simultánea, manteniendo sus datos completamente aislados entre sí.

Cada registro del sistema pertenece siempre a una empresa concreta, identificada mediante el campo `empresa_id`.

### 4.2 Usuario

El Usuario representa la identidad técnica que permite el acceso al sistema. Es la entidad que inicia sesión y ejecuta acciones dentro de la plataforma.

Es importante diferenciar claramente entre usuario y empleado:

* El usuario es una identidad de acceso.
* El empleado es una entidad laboral gestionada por el módulo de RRHH.

Ambas entidades pueden estar relacionadas, pero no son equivalentes.

### 4.3 Rol

El Rol define el perfil funcional de un usuario dentro de una empresa. Ejemplos de roles habituales son:

* Administrador
* Manager
* Empleado
* Responsable de RRHH

Un mismo usuario puede tener diferentes roles en función de la empresa o del contexto.

### 4.4 Permiso

El Permiso representa una acción concreta que puede realizarse en el sistema, como crear proyectos, aprobar solicitudes o acceder a información sensible.

Los roles agrupan permisos y determinan el nivel de acceso del usuario.

---

## 5. Autenticación y autorización

### 5.1 Autenticación

La autenticación es el proceso mediante el cual el sistema verifica la identidad del usuario. Normalmente se realiza mediante credenciales como correo electrónico y contraseña.

Esta responsabilidad recae exclusivamente en el módulo CORE.

### 5.2 Autorización

La autorización determina si un usuario autenticado puede realizar una acción concreta. Para ello, el CORE evalúa los roles y permisos asignados.

Los módulos funcionales no deciden permisos; simplemente consultan al CORE.

---

## 6. Datos comunes compartidos

El módulo CORE define una serie de campos comunes que deben estar presentes en las entidades del resto de módulos:

* `empresa_id`
* `usuario_id`
* `created_at`
* `updated_at`

Estos campos permiten:

* Mantener el contexto empresarial de los datos.
* Garantizar la trazabilidad de las acciones.
* Facilitar el análisis global del sistema.

---

## 7. Integración del CORE con otros módulos

El CORE se integra con todos los módulos del sistema proporcionando identidad y control de acceso.

Ejemplos de integración:

* RRHH: asociación entre usuarios y empleados.
* ALM: validación de permisos para crear y gestionar proyectos y tareas.
* CRM y ERP: control de acceso a clientes, ventas y facturación.
* BPM: uso de roles y usuarios para definir flujos de aprobación.
* BI: uso de datos comunes para análisis y reporting.

---

## 8. Alcance y limitaciones del CORE

El CORE no debe gestionar lógica de negocio específica. Quedan fuera de su alcance:

* Gestión de vacaciones o contratos.
* Gestión de proyectos o tareas.
* Gestión de clientes o facturación.
* Definición de procesos empresariales.

Estas responsabilidades corresponden a los módulos funcionales correspondientes.

---

## 9. Conclusión

El módulo CORE es un elemento crítico de la arquitectura del sistema. Su correcta definición garantiza la seguridad, coherencia e integración de la plataforma, permitiendo que el resto de módulos operen de forma coordinada y escalable.
