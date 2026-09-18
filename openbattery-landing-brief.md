# Brief para la landing de OpenBattery

Documento de referencia para que Claude Code genere la página estática de OpenBattery.
Fuente de verdad: rama `dev` de `Im-Fran/openbattery`, commit `964637d`, revisada leyendo el código
(no solo el README — ver "Correcciones al README" al final, el README tiene dos puntos desactualizados).

**Idioma de la página: inglés.** La app, su interfaz y el repositorio están en inglés; una landing en
español mostrando capturas en inglés se leería incoherente. Todos los textos entre comillas de este
documento son copy literal, en inglés, listo para usar.

---

## 1. Identidad del producto

- **Nombre:** OpenBattery
- **Qué es:** app nativa de macOS que vive en la barra de menús y muestra lo que la batería realmente
  está haciendo, leyendo directamente del IORegistry.
- **Tagline principal (hero):** "See what your battery is actually doing."
- **Subtítulo del hero:** "macOS shows you a percentage. Your battery knows how many milliamp-hours it
  really holds, how many watts are flowing right now, how hot it has ever been and when it was built.
  OpenBattery puts all of it in your menu bar."
- **Autoría:** Francisco Solís — © 2026 FranciscoSolis E.I.R.L. (RUT 78.473.345-9, Chile)
- **Licencia:** MIT
- **Repositorio:** https://github.com/Im-Fran/openbattery
- **Sitio del autor:** https://fsolism.cl
- **Bundle ID:** `cl.franciscosolis.openbattery`
- **Versión:** 1.0.0 (build 1)
- **Ícono:** existe en `Sources/OpenBattery/Resources/Assets.xcassets/AppIcon.appiconset/`
  (1024, 512, 256, 128, 64, 32, 16 px). Usar `openbattery-icon-1024.png` para el hero y el favicon.
- **Banner:** `.github/assets/readme-banner.webp` — muestra tres ventanas Battery Info (tabs Lifetime,
  Power y Charge). Sirve como imagen principal del hero y como Open Graph image.

## 2. Requisitos (importante, cambió)

- **macOS 14 (Sonoma) o superior.**
- **Solo Apple Silicon.** Los Mac Intel no son compatibles (`ARCHS: arm64`, decisión explícita en
  `project.yml`). La página debe decirlo, no esconderlo.
- Para compilar: Xcode con el SDK de macOS y XcodeGen (`brew install xcodegen`).

## 3. Los cinco argumentos de venta

Van en una franja de "por qué OpenBattery" o como tarjetas bajo el hero:

1. **"No root. No helper. No daemon."** Todo sale de IOKit con permisos normales de usuario. No
   instala launch daemon, no pide contraseña, no lanza `ioreg` ni `pmset` por debajo.
2. **"Read-only, by design."** OpenBattery lee, nunca escribe en el SMC. No puede dejar la batería en
   un estado raro porque no toca nada.
3. **"~18 MB and 0 % CPU at idle."** Sin loop de polling: IOKit despierta la app cuando cambia la
   fuente de energía. El timer solo corre cuando hay algo en pantalla que lo necesita, y se apaga solo.
4. **"No dependencies."** Swift + SwiftUI + IOKit. Nada de terceros.
5. **"Open source, MIT."** Código completo auditable en GitHub.

Franja de números sugerida: `~18 MB RAM` · `0 % CPU idle` · `0 dependencies` · `100 % local`

## 4. Funcionalidades (sección de features)

### 4.1 Barra de menús configurable

Ocho campos disponibles, cada uno se puede mostrar u ocultar:

`Percentage` · `Time remaining` · `Charging status` · `Battery watts` · `Adapter watts` ·
`System watts` · `Charge in mAh` · `Temperature`

Se configuran en **Settings → Menu Bar** (⌘,). La interfaz es un campo de tokens: se arrastran para
reordenar, se arrastran desde la paleta para agregar, y se arrastran fuera para quitar. **Cada gesto de
arrastre tiene equivalente por clic, menú contextual y VoiceOver** — vale la pena mencionarlo, es un
detalle de accesibilidad poco común.

Ejemplo de render de la barra de menús (usar textual en el hero o en un mockup):

```
🔋 97% · +8.6 W · 4,991 mAh
```

Detalles que dan carácter y conviene contar:
- Los campos se unen con ` · ` **en el orden que el usuario eligió** (se puede reordenar).
- Un campo duplicado se descarta automáticamente.
- **Lo que no está disponible se omite, no se muestra como guion**: un Mac desconectado simplemente no
  muestra watts del adaptador. "A dash in the menu bar is worse than nothing."
- Si se esconde el ícono *y* todos los campos quedan sin valor, el ícono vuelve solo — un ítem
  invisible en la barra de menús no se podría volver a clickear.
- Solo `Percentage`, `Time remaining` y `Charging status` son gratis. Elegir watts, mAh o temperatura
  activa la lectura detallada en un timer de 10 s (~0,2 % de CPU). La página debe decir este costo.
- El ícono de batería cambia según carga (`battery.0` → `battery.100`, con rayo al cargar) y muestra
  `powerplug` en un Mac sin batería.
- Cuando "Keep display awake" está activo aparece una taza (`cup.and.saucer.fill`) junto al ícono.

### 4.2 Popover

Se abre al hacer clic en la barra de menús. Está diseñado para verse como los propios menu bar extras
del sistema (Wi-Fi, Batería, Sonido): mismo inset de 14 pt, separadores, filas con highlight redondeado
al pasar el mouse. Ancho: 300 pt.

Contiene:
- Encabezado "Battery" + indicador "Low Power" (hoja verde + texto, nunca solo color).
- Porcentaje grande + estado en palabras + carga en mAh + barra de nivel (`Gauge`) con color según estado.
- Bloque **Power**: `Input`, `Battery` (con signo), `System`, `Temperature`.
- **Limit charging** — sección desplegable con la guía (ver sección 6).
- **Keep display awake** — switch con advertencia (ver 4.4).
- Filas de menú: `Battery Info…` (⌘I), `Settings…` (⌘,), `Quit OpenBattery` (⌘Q).

Textos de estado literales que genera la app: `"Full in 1 h 20 m"`, `"2 h 15 m left"`, `"Charging"`,
`"Fully charged"`, `"Plugged in, not charging"`, `"On battery"`, `"No battery"`.

### 4.3 Ventana Battery Info — cuatro tabs, gráficos incluidos

Es la novedad más grande y debe ser la estrella de la página. Se abre con ⌘I y cada tab tiene atajo
(⌘1–⌘4) listado en el menú **View**. La ventana mide mínimo 440×420 pt, ideal 500×520.

**Todos los tabs usan exactamente el mismo layout**, y eso es una decisión de diseño que vale la pena
destacar: *una lectura protagonista (hero), tres cifras al lado, y la historia o el desglose debajo.*
"Moving between them never asks anyone to learn a new layout."

| Tab | Hero | Tres tiles | Detalle debajo |
|---|---|---|---|
| **Charge** (⌘1) | Porcentaje, con ícono de batería que se llena y estado en palabras; debajo, mAh actuales sobre mAh de carga completa y temperatura | Time to full · Time to empty · Low Power Mode | **Gráfico de las últimas 12 horas** de nivel de carga, una barra por hora |
| **Power** (⌘2) | Watts en movimiento: lo que entrega el adaptador si está conectado, o lo que entrega la batería si no; debajo, descripción del adaptador (nombre, W nominales, V, A) | Battery (watts con signo) · Battery voltage · Battery current | **Gráfico de carga del sistema de los últimos 60 segundos** |
| **Health** (⌘3) | Salud en %, verde sobre 80 % y naranja bajo; estado en palabras: "Normal · no service recommended" o "Below 80% of design capacity · service recommended"; debajo, mAh de carga completa sobre capacidad de diseño | Cycles · Age · Nominal | **Gráfico de los últimos 12 meses** de capacidad retenida + filas con Manufactured, Serial number y Gauge |
| **Lifetime** (⌘4) | Temperatura promedio de toda la vida de la batería + veredicto ("Within the ideal operating range" / "Warmer than…" / "Cooler than…") | Temperature range · Voltage range · Operating time | **Barras comparando** el pico de corriente de carga contra el de descarga |

Cuatro detalles de esta ventana que son buen material de copy:

- **La historia se la escribe la app.** "The gas gauge keeps no history, so the only history that
  exists is the one we write down." La batería no guarda historial; OpenBattery anota la carga cada
  5 minutos (12 horas de historia) y la capacidad de carga completa una vez al día (12 meses). Todo en
  `UserDefaults`, **nada sale del Mac**, sin archivos ni base de datos.
- **Los huecos se muestran como huecos.** Si el Mac estaba dormido o la app no corría, esa hora queda
  vacía en el gráfico en vez de inventar un valor. "Gaps are expected and honest."
- **Cada cifra tiene su explicación.** Todos los tiles y encabezados llevan un texto que explica qué
  significa el número en lenguaje llano — por ejemplo, sobre los ciclos: "A cycle is one full charge's
  worth of use, not one plug-in: two days at half a charge each count as one."
- **La ventana se pausa sola.** Cuando queda tapada por otra app o la app se oculta, deja de leer.
  "A battery utility polling behind another app is a poor joke."
- Si el Mac no tiene batería, en vez de una pared de guiones muestra "No Battery — This Mac doesn't
  have a built-in battery."
- El tab Lifetime se deshabilita (gris, no desaparece) si el gas gauge no tiene registro de vida útil:
  "a missing menu item reads as a bug where a disabled one reads as 'not on this Mac'."

### 4.4 Keep display awake (nuevo)

Switch en el popover que impide que la pantalla se duerma por inactividad — el equivalente de
`caffeinate -d`. Cerrar la tapa o bloquear la pantalla la sigue apagando: solo detiene el temporizador
de inactividad, no le pasa por encima al usuario.

Dos detalles honestos que conviene mostrar:
- Advertencia visible: "Keeping the display on uses more power and drains the battery faster." El
  triángulo de alerta **solo aparece cuando el switch está encendido**; apagado es un ícono de info.
  "A standing alarm for a state you are not in is how people learn to ignore alarms."
- **No se recuerda entre sesiones**: al reiniciar arranca apagado. "Waking up to a display pinned on by
  last week's toggle is a surprise nobody asked for."
- Mientras está activo, una taza aparece en la barra de menús para que no se olvide encendido.

### 4.5 Ventana de Settings (⌘,)

Dos paneles, al estilo de cualquier app Mac:
- **General**: ícono y descripción de la app, switch de *Launch at login* (vía `SMAppService`, con
  manejo del caso "requiere aprobación" que abre el panel correcto del sistema), versión, "Data source:
  IOKit, read-only", licencia MIT, enlace a GitHub y a reportar un issue.
- **Menu Bar**: el campo de tokens descrito en 4.1.

### 4.6 Ícono en el Dock dinámico

La app es un agente `LSUIElement`: no tiene ícono en el Dock ni ventana al arrancar. Pero **cuando hay
una ventana abierta aparece el ícono en el Dock**, y desaparece al cerrarla. Sin ícono no habría forma
de traer la ventana de vuelta cuando otra app la tapa.

## 5. Accesibilidad (sección propia, es un diferenciador real)

El código tiene un cuidado en accesibilidad que casi ninguna app de este tipo tiene. Merece su sección:

- **El color nunca es la única señal.** El estado de carga, el Low Power Mode y las advertencias
  siempre se dicen también en palabras.
- **VoiceOver lee resúmenes, no símbolos.** La barra de menús se anuncia como "Battery 97%, charging,
  keeping display awake", no como el nombre del ícono.
- Donde la pantalla muestra "—", VoiceOver dice **"Not available"**, porque un em dash suelto suena a
  control roto, no a dato inexistente.
- El número de serie se deletrea, porque VoiceOver lo leería como una palabra.
- Todo lo que se hace arrastrando se puede hacer con clic, menú contextual o teclado.
- Los textos secundarios usan un gris más oscuro que `.secondary` para cumplir contraste 4.5:1.

## 6. Sección "Why OpenBattery doesn't limit charging"

Sección honesta, y probablemente la más memorable de la página. Copy base:

> macOS limits charging by itself, so OpenBattery does not. This used to be the job of third-party
> tools that wrote SMC keys as root. On current firmware that door is closed: the charge-limit keys
> (`bfF0`, `bfD0`, `bfE0`) answer `kIOReturnNotPrivileged` even to root, because the system owns them
> now. Shipping a privileged helper would add a launch daemon, an approval prompt and a way to strand
> your battery on a stuck charge gate — to reach a setting macOS already offers.

En vez de eso, el popover tiene una sección **Limit charging** que explica los pasos y abre el panel
correcto:
1. Open Battery settings.
2. Click the ⓘ button next to **Charging**.
3. Drag **Charge Limit** to 80, 85, 90 or 95 %.

## 7. Sección "Under the hood" / notas técnicas

Buen contenido para lectores técnicos, y demuestra rigor. Tres valores del gas gauge que hubo que
**decodificar**, no solo leer:

- **`ManufactureDate` parece un entero gigante** (`57390245359923`), pero sus bytes en little-endian son
  ASCII `DDMMYY` → `"310524"` = 31 de mayo de 2024. Si eso falla, se usa el código `YYWW` dentro de
  `MfgData` (`"2419"` = 2024, semana 19).
- **Las temperaturas mezclan escalas dentro del mismo diccionario**: centi-Celsius para la lectura en
  vivo (`3059` = 30,59 °C), deci-Celsius para el promedio histórico (`243` = 24,3 °C) y Celsius plano
  para el rango histórico (`45` = 45 °C). OpenBattery elige la escala por magnitud y rechaza cualquier
  valor fuera de −40…100 °C, que una celda de litio no podría reportar.
- **`TotalOperatingTime` no tiene unidad documentada.** Se lee como horas y se muestra el contador crudo
  al lado, "so a wrong assumption stays visible rather than becoming a confident lie".

Los tres están cubiertos por tests con fixtures de hardware real.

Política de lectura (vale la pena un diagramita simple):

| Situación | Qué hace |
|---|---|
| Barra de menús con solo carga y estado | **Cero polling.** IOKit avisa cuando cambia la fuente de energía |
| Barra de menús con watts / mAh / temperatura | Lectura detallada cada **10 s** (~0,2 % CPU) |
| Popover o ventana abierta y visible | Lectura detallada cada **5 s** |
| Ventana tapada u app oculta | Se pausa |

Además, si la lectura nueva es idéntica a la anterior, SwiftUI ni siquiera se invalida.

## 8. Stack técnico (tabla)

| Capa | Tecnología |
|---|---|
| Lenguaje | Swift 5, deployment target macOS 14, arm64 |
| UI | SwiftUI (`MenuBarExtra`, `Window`, `Settings`, `TabView`) |
| Gráficos | Swift Charts |
| Datos | IOKit — `IORegistryEntryCreateCFProperty`, `IOPSNotificationCreateRunLoopSource` |
| Fuentes | `AppleSmartBattery` y `AppleSmartBatteryPack` |
| Mantener pantalla encendida | IOKit power assertions (`kIOPMAssertPreventUserIdleDisplaySleep`) |
| Inicio automático | ServiceManagement (`SMAppService`) |
| Persistencia | `UserDefaults` — sin archivos, sin base de datos |
| Generación del proyecto | XcodeGen desde `project.yml` (el `.xcodeproj` no se commitea) |
| Tests | XCTest — decodificación, formato, configuración de barra de menús, logs de muestras |
| CI | GitHub Actions en `macos-latest`: build + test sin firma |

Tamaño del proyecto: ~2.900 líneas de Swift en 13 archivos fuente y 4 de tests.

## 9. Instalación (sección de la página)

```bash
git clone https://github.com/Im-Fran/openbattery.git
cd openbattery
# poner tu DEVELOPMENT_TEAM en project.yml
make run
```

| Comando | Qué hace |
|---|---|
| `make build` | Compila y firma en `build/Release/OpenBattery.app` |
| `make run` | Compila y lanza la app en la barra de menús |
| `make install` | Copia a `/Applications` y lanza |
| `make test` | Tests unitarios |
| `make uninstall` | Saca la app de `/Applications` |
| `make clean` | Borra `build/` y el proyecto Xcode generado |

Para encontrar el team ID de firma:
```bash
security find-certificate -c "Apple Development" -p | openssl x509 -noout -subject
```
El campo `OU=` es el team ID.

**Nota:** hoy no hay release binario publicado. La página debe ofrecer "Build from source" y enlace a
GitHub, **no** un botón "Download .dmg" que no existe. Si más adelante hay releases, el botón puede
apuntar a `/releases/latest`.

## 10. Estructura sugerida de la página

1. **Hero** — ícono, nombre, tagline, subtítulo, el banner de tres ventanas, dos botones
   ("View on GitHub" y "Build from source" → ancla a instalación) y los badges macOS 14+ · Apple
   Silicon · Swift 5 · MIT.
2. **Franja de números** — ~18 MB · 0 % CPU idle · 0 dependencies · 100 % local.
3. **Menu bar** — mockup de la barra con `🔋 97% · +8.6 W · 4,991 mAh` + los ocho campos como chips +
   explicación del costo de los campos detallados.
4. **The window** — los cuatro tabs, idealmente con tabs interactivos en HTML que muestren capturas o
   recreaciones. Es la sección más vendedora.
5. **The history is yours** — que la app se escribe su propio historial, en el Mac, con huecos honestos.
6. **Why it doesn't limit charging** — sección 6, en tono directo.
7. **Built for everyone** — accesibilidad, sección 5.
8. **Under the hood** — sección 7: los tres valores traicioneros y la tabla de política de lectura.
9. **Tech stack** — tabla.
10. **Install** — bloques de código.
11. **Footer** — MIT, © 2026 FranciscoSolis E.I.R.L., GitHub, fsolism.cl.

## 11. Dirección de diseño sugerida

- **Tono:** técnico, directo y honesto. La app dice lo que no sabe; la página debe sonar igual. Nada de
  superlativos de marketing ("revolucionario", "el mejor").
- **Estética:** oscura por defecto, con soporte de tema claro. Tipografía de sistema (SF Pro / `-apple-
  system`) y números tabulares y monoespaciados en las cifras, como hace la app (`monospacedDigit`).
- **Paleta:** tomar los colores de la propia app — verde para carga sana, naranja para advertencia,
  rojo bajo 20 %, azul para el adaptador, gris para el reposo.
- **Fondo:** algo que evoque el vidrio esmerilado de macOS, sin exagerar.
- **Sin frameworks pesados.** HTML + CSS estáticos; JavaScript solo para los tabs interactivos y el
  cambio de tema. Debe poder servirse desde GitHub Pages sin build.
- **Responsive**, con gutter de 16 px en móvil y sin scroll horizontal.
- **Imágenes:** el banner y el ícono ya existen en el repo. Faltan capturas individuales del popover, de
  la ventana Settings y de cada tab por separado. Si no están disponibles, recrear el popover y la barra
  de menús en HTML/CSS es viable y queda bien; para la ventana Battery Info, recortar el banner.

## 12. Correcciones al README (el código manda)

Al escribir la landing, **no copiar estas dos frases del README**, que quedaron desactualizadas:

1. El README dice que los campos de la barra de menús van "in a fixed order". **Ya no**: desde el commit
   `b4b5127` el usuario los reordena arrastrando, y el orden elegido es el que se usa.
2. El README todavía describe la ventana Battery Info como "the full picture, grouped for reading" en
   algunos puntos y su tabla de grupos mezcla la versión vieja con la nueva. La estructura real es la de
   la sección 4.3 de este documento: cuatro tabs, hero + tres tiles + detalle, con gráficos.

Tampoco están en el README, y sí en el código: **Keep display awake**, la **ventana de Settings**
separada, el **ícono dinámico en el Dock**, el **campo de tokens arrastrable** y los **atajos ⌘1–⌘4**.
