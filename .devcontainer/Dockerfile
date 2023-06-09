FROM node:16

# Installieren von globalen Abhängigkeiten
RUN npm install -g gulp yo @microsoft/generator-sharepoint

# Legen Sie das Arbeitsverzeichnis im Container fest
WORKDIR /usr/src/app

# Expose Gulp-Port (optional)
EXPOSE 4321

CMD [ "bash" ]

# Benutzer und Gruppe anlegen
RUN groupadd --gid 3000 spfx \
  && useradd --uid 3000 --gid spfx --shell /bin/bash --create-home spfx

# Besitzer der Arbeitsverzeichnisse wechseln
RUN chown -R spfx:spfx /usr/src/app

# Benutzer wechseln
USER spfx
