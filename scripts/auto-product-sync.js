import cron from 'node-cron';
import { spawn } from 'child_process';

// Cron-Job für tägliche Produkt-Synchronisation (jeden Tag um 02:00 Uhr)
const job = cron.schedule('0 2 * * *', () => {
  console.log('🚀 Starte automatische Produkt-Synchronisation...');

  const syncProcess = spawn('npm', ['run', 'product-sync'], {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  syncProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Produkt-Synchronisation erfolgreich abgeschlossen');
    } else {
      console.error('❌ Produkt-Synchronisation fehlgeschlagen mit Code:', code);
    }
  });

  syncProcess.on('error', (error) => {
    console.error('❌ Fehler beim Starten der Produkt-Synchronisation:', error);
  });
}, {
  scheduled: false, // Nicht sofort starten
  timezone: "Europe/Berlin"
});

// Cron-Job starten
job.start();

console.log('🚀 Automatischer Produkt-Sync-Cron-Job gestartet');
console.log('� Nächste Synchronisation: jeden Tag um 02:00 Uhr');
console.log('💡 Cron-Job läuft im Hintergrund...');

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Cron-Job wird beendet...');
  job.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('� Cron-Job wird beendet...');
  job.stop();
  process.exit(0);
});