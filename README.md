# Burger House

Sitio web de hamburguesas con carrito de compra personalizable (combos con
grupos de opciones obligatorias/opcionales), reservas y pedidos que se
confirman por WhatsApp, login con Supabase Auth, y cupón automático de
descuento cada 10 compras.

## 1. Requisitos

- Node.js 20+
- Una cuenta gratuita en [supabase.com](https://supabase.com)

## 2. Instalar dependencias

```bash
npm install
```

## 3. Crear el proyecto en Supabase

1. Crea un proyecto nuevo en Supabase.
2. Ve a **SQL Editor** y ejecuta el contenido completo de `supabase/schema.sql`.
   Esto crea las tablas (`products`, `option_groups`, `options`, `orders`,
   `order_items`, `reservations`, `coupons`, `profiles`), las políticas de
   seguridad (RLS), y los triggers automáticos:
   - `on_auth_user_created`: crea el perfil apenas alguien se registra.
   - `on_order_created`: suma la compra al contador del usuario y, cada 10,
     genera un cupón de 15% automáticamente.
3. Ve a **Authentication > Providers** y confirma que "Email" esté activo.
4. Ve a **Authentication > Emails** para personalizar la plantilla del correo
   de confirmación (es el correo que le llega al usuario a su Gmail cuando
   crea su cuenta).
5. (Recomendado para producción) Ve a **Project Settings > Auth > SMTP
   Settings** y conecta un proveedor como [Resend](https://resend.com) o
   SendGrid — el SMTP por defecto de Supabase tiene límites bajos de envío.
6. Copia tu **Project URL** y **anon public key** desde **Project Settings
   > API**.

### Sobre el catálogo de productos

Ahora mismo el catálogo (`src/lib/data/products.ts`) vive como datos
estáticos en el código — así puedes probar todo el flujo de inmediato sin
depender de la base de datos. Cuando quieras que el catálogo sea 100%
dinámico (para poder editarlo desde un panel admin sin tocar código),
migramos esos mismos productos a las tablas `products` / `option_groups` /
`options` y el frontend los consulta desde ahí.

## 4. Variables de entorno

Copia `.env.local.example` a `.env.local` y completa:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=51987654321
```

`NEXT_PUBLIC_WHATSAPP_NUMBER` es el número de WhatsApp de la empresa, en
formato internacional y solo dígitos (código de país + número, sin `+` ni
espacios).

## 5. Correr en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## 6. Estructura del proyecto

```
src/
  app/              Páginas (home, login, register, account, auth/confirm)
  components/       Header, Hero, carrusel, menú, modal de personalización,
                     carrito, formulario de reservas, footer
  actions/          Server Actions: auth, pedidos, reservas
  lib/
    supabase/       Clientes de Supabase (browser y server)
    data/products.ts  Catálogo de productos y combos
    cart-store.ts   Carrito (Zustand)
    whatsapp.ts     Helpers para armar los mensajes de WhatsApp
supabase/
  schema.sql        Esquema completo de base de datos + triggers
```

## 7. Qué falta para producción

- **Imágenes reales de producto**: hoy se usan placeholders con degradado +
  ícono (`PlaceholderImage.tsx`). En cuanto tengas las fotos o quieras
  generarlas con IA, se reemplaza el `imageUrl` de cada producto en
  `src/lib/data/products.ts` y se sube el archivo a
  `public/images/products/` o al bucket `product-images` de Supabase
  Storage (ya viene creado en el schema).
- **Pasarela de pago real** (Culqi/MercadoPago): por ahora el checkout arma
  el pedido y lo confirma por WhatsApp, tal como pediste. Cuando quieras
  sumar pago en línea, se agrega como un paso adicional antes de la
  redirección a WhatsApp.
- **Panel de administración**: para gestionar productos, ver reservas y
  pedidos desde una interfaz en vez de directamente en Supabase.
