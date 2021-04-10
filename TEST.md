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

![test.jpg](devnote://6070efb01e59ad35d556a7cf.jpg?name=test&ext=jpg&type=image/jpeg) 


