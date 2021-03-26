--- #retro #03/03/21

- [ ] Integrar StoryBook en crema Front
- [ ] Afinar un documento de onboarding

--- #howto #wls

#### Como limitar consumo de memoria en wls2

En \`%UserProfile%\.wslconfig\`

```
[wsl2]
memory=6GB
swap=0
localhostForwarding=true
```

--- #activity #03/03/21

- Conversación con Jorge de como estructurar el plugin.
- Parche de plugin para permitir varios default en el raíz.
- Evitar que se inluyan los dos allowedScreen en en nombre de los frame

--- #activity #04/03/21

- PR del nuevo formato de fechas en **JOBS**
- (Figma) Revisar un nuevo modo de comunicación entre el iframe y el sandbox
- Investigar como manejar _RTL_ en el plugin

--- #howto #git #04/03/21

#### Forzar que mi rama local se actualice a los cambios de la rama remota

```
git reset --hard origin/feature/xxxxx
```

--- #activity #05/03/21

- Fix Customization tab. Malentendido con los prerrquisitos.
- Revisiar PR de Alex del nuevo workflow

--- #retro #05/03/21

- [ ] Preguntar por el soporte que nos da Figma.
- [ ] Pararse a documentar un poco las funcionalidades del plugin.

--- #cheatsheet #docker

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
