import fs from 'fs';
import net from 'net';
import path from 'path';

// Faylın tam yolunu tapırıq
const REGISTRY_PATH = path.join(process.cwd(), 'PORT_REGISTRY.md');

if (!fs.existsSync(REGISTRY_PATH)) {
  console.error("PORT_REGISTRY.md faylı tapılmadı.");
  process.exit(1);
}

const content = fs.readFileSync(REGISTRY_PATH, 'utf-8');
const lines = content.split('\n');

// Portun aktiv olub-olmadığını yoxlayan funksiya
const checkPort = (port) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    
    // 2 saniyə timeout (əgər 2 saniyəyə cavab gəlməzsə, port qapalıdır)
    socket.setTimeout(2000);
    
    socket.on('connect', () => {
      socket.destroy();
      resolve(true); // Port açıqdır
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false); // Port qapalıdır
    });
    
    socket.on('error', () => {
      resolve(false); // Port qapalıdır
    });
    
    socket.connect(port, '127.0.0.1');
  });
};

async function main() {
  let updated = false;
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Regex ilə cədvəldəki port nömrəsini çıxardırıq
    // Nümunə format: | **5050** | `eventrent-az-rebuild` | **IN_USE** | ...
    const match = line.match(/^\|\s*\*?\*?(\d+)\*?\*?\s*\|/);
    
    if (match) {
      const port = parseInt(match[1], 10);
      const isStatusInUse = line.includes('IN_USE');
      
      if (isStatusInUse) {
        const isOpen = await checkPort(port);
        
        if (!isOpen) {
          console.log(`Port ${port} aktiv deyil. Siyahıda "AVAILABLE" olaraq dəyişdirilir...`);
          // "IN_USE" statuslarını "AVAILABLE" ilə əvəzləyirik
          let newLine = line.replace(/\*\*IN_USE\*\*/g, 'AVAILABLE').replace(/IN_USE/g, 'AVAILABLE');
          newLines.push(newLine);
          updated = true;
          continue;
        } else {
          console.log(`Port ${port} aktivdir.`);
        }
      }
    }
    
    newLines.push(line);
  }
  
  if (updated) {
    fs.writeFileSync(REGISTRY_PATH, newLines.join('\n'), 'utf-8');
    console.log(`[${new Date().toISOString()}] PORT_REGISTRY.md güncəlləndi. Aktiv olmayan portlar təmizləndi.`);
  } else {
    console.log(`[${new Date().toISOString()}] Heç bir dəyişiklik edilmədi, siyahıdakı bütün IN_USE portlar hal-hazırda aktivdir.`);
  }
}

main();