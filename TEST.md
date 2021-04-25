--- #retro #03/03/2021

- [ ] Integrar StoryBook en crema Front
- [ ] Afinar un documento de onboarding

--- #howto #wls #03/03/2021

#### Como limitar consumo de memoria en wls2

En \`%UserProfile%\.wslconfig\`

```
[wsl2]
memory=6GB
swap=0
localhostForwarding=true
```

--- #activity #03/03/2021

- Conversación con Jorge de como estructurar el plugin.
- Parche de plugin para permitir varios default en el raíz.
- Evitar que se inluyan los dos allowedScreen en en nombre de los frame

--- #activity #04/03/2021

- PR del nuevo formato de fechas en **JOBS**
- (Figma) Revisar un nuevo modo de comunicación entre el iframe y el sandbox
- Investigar como manejar _RTL_ en el plugin

--- #howto #git #04/03/2021

#### Forzar que mi rama local se actualice a los cambios de la rama remota

```
git reset --hard origin/feature/xxxxx
```

--- #activity #05/03/2021

- Fix Customization tab. Malentendido con los prerrquisitos.
- Revisiar PR de Alex del nuevo workflow

--- #retro #05/03/2021

- [ ] Preguntar por el soporte que nos da Figma.
- [ ] Pararse a documentar un poco las funcionalidades del plugin.

--- #cheatsheet #docker #7/4/2021

```
# ... port mapping
docker run -it -p 8888:8888 tensorflow/tensorflow

# ... montar directorios de la máquina host
docker run -it --rm -v d:\Cursos\Deep-Q-Learning:/tf -p 8888:8888 tensorflow115

# listar todos los contenedores
docker ps -a

# Eliminar contenedores
docker rm <container name or id>

# ...todos
docker rm $(docker ps -qa)

#Eliminar imágenes
docker rmi <image_id>

# Eliminar todo lo que no se esté usando
docker system prune -a
```

--- #activity #7/4/2021

Esta línea sigue apareciendo muy lejos del límite superior de la sección a la que pertenece. De todos modos puede ser interesante ve como evoluciona esto.

--- #howto #7/4/2021

```
const str = "cadena de texto";
```

--- #tip #9/4/2021

### La transformada de Fourier
El problema de esta transformada es que las matemáticas detrás de ella son bastante avanzadas. Solo hay que echar un vistazo a la expresión matemática para visualizar todo lo que hay detrás. La voy a poner aquí pero también adelanto que a lo largo de este artículo vermeos una explicación sencilla, tanto del concepto como de las matemáticas detrás de ella.

$$
f(x) = \int_{-\infty}^\infty \hat{f}(\xi)\,e^{2 \pi i \xi x}\,d\xi
$$

--- #devnote #presentacion #10/4/2021

1. `devnote` es simplemente un editor. No es un servicio.
2. Notas totalmente privadas 🔐. Tú decides dónde y cómo guardas tus notas.
3. `wyswyg` llevado a otro nivel. Edición y preview en la misma interfaz.
4. <kbd>h</kbd> <kbd>j</kbd> <kbd>k</kbd> <kbd>l</kbd> : una vez que se te menten en la cabeza lo quieres en todos lados.
5. :point_right: Extensible a través de scripts. - Pendiente definier API-

---

### tables

|     | lun | mar | mier | juev | vier |
| --- | --- | --- | ---- | ---- | ---- |
| uno | dos | tre |      |      |      |
|     |     |     |      |      |      |

### 🏕 imágenes

![6084530ec382e5aa19e21415.png](devnote://60848c90d4442918b6afecbc.png?name=6084530ec382e5aa19e21415&ext=png)

### $\infin$ fórmulas

Esto es un texto normarl $\infin$ para ver como se ve. El teorema de pitágoras: $h = \sqrt{a^2 + b^2}$

$$
f(x) = \int_{-\infty}^\infty \hat{f}(\xi)\,e^{2 \pi i \xi x}\,d\xi
$$

### ✏ formátos básicos de texto

### 🆘 ayuda contextual <kbd>Ctrl + .</kbd>

### 📐 diagramas

### 🎨 dibjujos

![](devnote://60848cb699a9b557db6d1cf8.png?name=&ext=png&exca=60848cb699a9b557db6d1cf8&align=center&ts=1619299589496)

--- #todo #10/4/2021

### lo básico
- [x] elegir una librería para manejar el estado: ✔ [zustang](https://github.com/pmndrs/zustand) vs ❌ [unstated](https://github.com/jamiebuilds/unstated-next)
- [x] autocompletar `$`.
- [ ] implementar el autocompletado en `execution mode`
- [ ] :rotating_light: se pierde información. :rotating_light: $\implies$ Cuando se aplican varios filtros seguidos y se hace una modificación parece que hay problemas.
- [ ] folding.
- [ ] exportado pdf.
- [ ] pensar en una estrategia de etiquetado. Dar sentido a la sección `devnote`.
- [ ] evitar renderizar directamente en el `body`
- [ ] comandos básicos
  - [x] **draw**: excalidraw. Si estoy sobre un dibujo abrirlo para su edición.
  - [ ] **duplicate**: duplica la vista actual y le actualiza las fechas.
  - [ ] afinar el filtrado. Incluir filtrado por bloques: `@[math|todo|draw|image|...]`
  - [ ] **linkto**: crear una sección enlazada desde la actual. 🤔
    - Pensar el workflow de creación y navegación entre enlaces. [[]]
  - [ ] el puto autocompletado.
 
--- #implementation #25/4/2021

### Incluir excalidraw
Implementar el comando `:draw` con dos posibilidades:

- Cuando se lanza sobre una línea _no vacía_ se buscará en la línea (a partir de la posición del actual del cursor) una imagen que tenga extensión `excalidraw` y se lanzará el editor para editar dicha imagen guardada.
- Cuando se lanza sobre una línea vacía se lanzará el editor para crear una nueva imagen e insertarla en la posición indicada.

### Estrategia de etiquetado
Esta podría ser la estructura por defecto para un día de trabajo. Está claro que dependerá del ámbito en el que estémos: tabajo, estudio, etc. Este concepto me puede ayudar a la hora de las _daylies_, _retrospetives_, etc.

![](devnote://60848d4933eb29d0f13ba5c9.png?name=&ext=png&exca=60848d4933eb29d0f13ba5c9&align=&ts=1619299720213)
