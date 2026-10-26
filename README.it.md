# dsh-prompt-polish (v0.2.0 per DeepSeek Harness 0.2.x)

✨ **DSH Prompt Polish** è un plugin per l'interfaccia Web di [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness). Aggiunge un pulsante con icona ✨ direttamente nella barra strumenti del compositore per riscrivere ed ottimizzare all'istante la bozza del prompt, rendendola chiara, strutturata ed efficace per il modello AI.

Questo repository è un **fork modernizzato e aggiornato** specificamente per **DSH 0.2.x** (inclusa la versione `0.2.0-rc.2`), risolvendo tutte le incompatibilità e i limiti della versione 0.1.0.

---

## 🔍 Cosa c'era di obsoleto nella versione 0.1.0

1. **Incompatibilità delle dipendenze (PeerDependencies)**:
   - La v0.1.0 vincolava `@deepseek-ai/dsh-llm` a `^0.1.0`. Su DSH 0.2.x (`0.2.0-rc.2`), `pnpm` rifiutava l'installazione o generava errori di peer dependency.
2. **Provider OpenRouter forzato (hardcoded)**:
   - `cordis.patch.yml` definiva in modo rigido `provider: openrouter` e `model: deepseek/deepseek-v4-flash-0731`. Chi non aveva OpenRouter configurato nelle impostazioni di DSH riceveva sempre l'errore `400: no model route available` o fallimenti di autenticazione.
3. **Mancata integrazione con `agentDefaultModel`**:
   - In DSH 0.2, il profilo gestisce nativamente il modello predefinito tramite il servizio `ctx.agentDefaultModel.currentSelection()`. La v0.1.0 ignorava questo servizio.
4. **Tassonomia dei messaggi non conforme a DSH 0.2**:
   - Generava un messaggio con `source: { kind: 'plugin' }`, deprecato in DSH 0.2 a favore della tassonomia standard `{ kind: 'user' }`.
5. **Mancanza di `"immediately": true` nel client**:
   - DSH 0.2 richiede il flag `"immediately": true` nella sezione `dsh.client` per caricare subito il modulo client nel browser senza attendere trigger secondari.
6. **Nessun supporto per l'italiano né per diverse modalità di riscrittura**:
   - L'interfaccia era solo in cinese, senza possibilità di scegliere lo stile né di annullare la modifica.

---

## 🚀 Nuove funzionalità e modifiche apportate (v0.2.0)

- 🧠 **Risoluzione automatica del modello DSH**:
  Non serve configurare nulla in `cordis.patch.yml`! Il plugin usa automaticamente il modello già configurato nelle impostazioni di DSH (`agentDefaultModel`). Se desiderato, è comunque possibile sovrascriverlo nei parametri del plugin o tramite configurazione.
- 🎨 **4 Stili di riscrittura selezionabili**:
  - **Bilanciato (Balanced)**: Chiaro, professionale, ben strutturato e bilanciato (predefinito).
  - **Conciso (Concise)**: Diretto, essenziale, privo di convenevoli e ridondanze.
  - **Dettagliato (Detailed)**: Strutturato in sezioni esplicite (*Obiettivo, Requisiti, Vincoli, Criteri di accettazione*).
  - **Codice (Code)**: Ottimizzato per compiti di programmazione (percorsi file, gestione errori, edge cases, test). Lo stile scelto viene memorizzato automaticamente in `localStorage`.
- ↩️ **Pulsante Ripristina / Undo immediato**:
  Dopo aver perfezionato il testo, compare un pulsante ↩️ **Ripristina**. Se il risultato non ti convince, un solo clic rimette la tua bozza originale nel box di testo.
- ⏹️ **Annullamento richiesta in corso (Cancel/Abort)**:
  Se il modello impiega troppo tempo, il pulsante durante l'elaborazione diventa arancione e permette di annullare la richiesta HTTP/LLM all'istante (`AbortController`).
- 🌐 **Interfaccia e rispetto della lingua (i18n)**:
  - L'interfaccia si adatta alla lingua del browser: **Italiano**, **Inglese** e **Cinese**.
  - Il prompt di sistema rispetta rigorosamente la lingua di input: se scrivi la bozza in italiano, il prompt perfezionato rimarrà in italiano; se scrivi in inglese, rimarrà in inglese.
- 💅 **Integrazione con i token CSS di DSH**:
  Utilizza le variabili di stile native (`--dsw-alias-border-l1`, `--dsw-alias-interactive-bg-hover`, `--dsw-radius-sm`), garantendo coerenza estetica sia in modalità scura che chiara.
- 📦 **Pronto all'uso senza build esterne**:
  Include i file `lib/index.js` e `lib/client.js` precompilati nel formato atteso dal caricatore client `window.__ModuleLoader__`, evitando i blocchi di pnpm 10 sugli script git `prepare`.

---

## 📥 Installazione

### Metodo 1: Aggiunta locale con `dsh plugin`

Dalla cartella del progetto (o specificando il percorso assoluto):

```bash
# Se sei dentro la cartella del fork:
dsh plugin --profile web add link:.

# Oppure indicando il percorso assoluto su Windows:
dsh plugin --profile web add link:D:\DshPolish
```

> **Nota:** Il prefisso `link:` dice a pnpm di creare un collegamento simbolico locale alla cartella, ideale per lo sviluppo e per non dover reinstallare a ogni modifica.

### Metodo 2: Riavvio della Web UI

Una volta aggiunto il plugin, avvia (o riavvia) la Web UI di DSH:

```bash
dsh web
```

Apri l'interfaccia nel browser: nella barra inferiore dell'input (accanto al pulsante di invio) vedrai il selettore di stile e il pulsante **✨ Perfeziona**!

---

## ⚙️ Configurazione opzionale (`cordis.patch.yml`)

Il plugin funziona subito senza nessuna configurazione. Se vuoi personalizzare le impostazioni predefinite, puoi modificarle in `cordis.patch.yml` o nel file di override del profilo (`$HOME/.dsh/profiles/web/cordis.patch.yml`):

```yaml
- insert:
    - id: prompt-polish
      name: 'dsh-prompt-polish'
      config:
        style: balanced       # balanced | concise | detailed | code
        maxTokens: 2000       # Limite token generati
        # provider: deepseek  # Opzionale: forza un provider specifico
        # model: deepseek-chat# Opzionale: forza un modello specifico
```

---

## 💡 Ulteriori miglioramenti suggeriti per il futuro

1. **Streaming in tempo reale (SSE / Chunk streaming)**:
   Attualmente l'endpoint server assembla i blocchi di testo e restituisce il risultato completo. Si potrebbe implementare un endpoint Server-Sent Events (SSE) per visualizzare il testo perfezionato mentre viene generato.
2. **Diff Side-by-Side (Prima vs Dopo)**:
   Mostrare un piccolo popover o modale a scomparsa che evidenzia le differenze tra la bozza originale e quella ottimizzata con due pulsanti dedicati: "Accetta" e "Rifiuta".
3. **Scorciatoia da tastiera (Keyboard shortcut)**:
   Aggiungere una scorciatoia globale (ad es. `Ctrl + Shift + P` o `Alt + P`) quando il cursore è nel campo di testo per lanciare la riscrittura senza usare il mouse.
4. **Iniezione del contesto di sessione (Context-Aware Polish)**:
   Includere opzionalmente informazioni minime del contesto della sessione corrente (come gli ultimi messaggi o i file toccati) affinché l'LLM possa contestualizzare ancora meglio i termini tecnici o le librerie a cui ci si riferisce.

---

## 📄 Licenza

Distribuito sotto licenza **MIT**. Consulta il file [LICENSE](./LICENSE) per i dettagli.
