const fs = require('fs');
const readline = require('readline');

const filesToUpdate = [
  './package.json',
  './config/package-solution.json',
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Funktion zum Lesen der aktuellen Versionsnummer aus der package.json
function getCurrentVersion() {
  return new Promise((resolve, reject) => {
    fs.readFile('./package.json', 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const versionMatch = data.match(/"version"\s*:\s*"(\d+\.\d+\.\d+(\.\d+)?)"/);
      if (versionMatch && versionMatch[1]) {
        resolve(versionMatch[1]);
      } else {
        reject(new Error('Versionsnummer nicht gefunden.'));
      }
    });
  });
}

// Hauptfunktion
(async () => {
  try {
    const currentVersion = await getCurrentVersion();
    console.log(`Aktuelle Versionsnummer: ${currentVersion}`);
  } catch (err) {
    console.error('Fehler beim Lesen der aktuellen Versionsnummer:', err);
    rl.close();
    return;
  }

  rl.question('Geben Sie die neue Versionsnummer ein (x.x.x.x): ', (newVersion) => {
    if (!/^\d+\.\d+\.\d+\.\d+$/.test(newVersion)) {
      console.error('Ungültige Versionsnummer. Bitte geben Sie eine gültige Versionsnummer im Format x.x.x.x ein.');
      rl.close();
      return;
    }

    const newVersionWithZero = `${newVersion}.0`;

    filesToUpdate.forEach((file) => {
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          console.error(`Fehler beim Lesen der Datei: ${file}`, err);
          return;
        }

        const updatedData = data.replace(/("version"\s*:\s*")\d+\.\d+\.\d+(\.\d+)?(")/, `$1${file.endsWith('.json') ? newVersion : newVersionWithZero}$3`);

        fs.writeFile(file, updatedData, 'utf8', (err) => {
          if (err) {
            console.error(`Fehler beim Schreiben der Datei: ${file}`, err);
            return;
          }
          console.log(`Versionsnummer in ${file} wurde erfolgreich auf ${newVersion} aktualisiert.`);
        });
      });
    });

    rl.close();
  });
})();
