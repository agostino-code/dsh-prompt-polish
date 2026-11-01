# dsh-prompt-polish (v0.2.1 per DeepSeek Harness 0.2.x)

✨ **DSH Prompt Polish** è un plugin avanzato per l'interfaccia Web di [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness). Aggiunge un pulsante con icona ✨ direttamente nella barra strumenti del compositore per riscrivere ed ottimizzare all'istante la bozza del prompt, rendendola chiara, strutturata ed efficace per il modello AI.

Questo repository è un **fork modernizzato e potenziato** per **DSH 0.2.x** (inclusa la versione `0.2.0-rc.2`).

---

## 🚀 Nuove funzionalità e miglioramenti implementati (v0.2.1)

1. ⚡ **Streaming in tempo reale (Server-Sent Events / SSE)**:
   La generazione non avviene più "al buio": i token riscritti vengono inviati in streaming man mano che il modello li produce. È possibile seguire il testo in tempo reale.
2. 🔍 **Finestra di confronto e revisione "Diff" (Side-by-side)**:
   All'avvio della riscrittura si apre un modale elegante (isolato via `createPortal` su `document.body` per non alterare la barra inferiore):
   - **A sinistra**: la tua bozza originale.
   - **A destra**: la versione ottimizzata che si compone in tempo reale.
   - **Selettore rapido modello**: possibilità di cambiare il modello al volo direttamente dal footer del modale.
   - **Pulsanti dedicati**:
     - **Accetta**: scrive la proposta perfezionata direttamente nel box di input.
     - **Rifiuta**: chiude la vista e lascia intatta la tua bozza.
     - **Copia**: copia il testo perfezionato negli appunti senza modificare il box.
3. 🧠 **Consapevolezza del contesto di sessione (Context-Aware Polish)**:
   Un comodo pulsante a pillola **🧠 Contesto** permette di attivare o disattivare l'inclusione del contesto della sessione corrente:
   - Percorso del workspace attivo (`cwd`).
   - Obiettivo attivo (`active goal`).
   - Elenco dei task/todos in corso.
   - **Panoramica del progetto**: manifest (package.json/pyproject/Cargo), estratto del README e struttura della radice, perché il prompt perfezionato resti coerente col progetto.
   - **Recap degli ultimi prompt**: sintesi degli ultimi messaggi utente dalla sessione, per continuità con la conversazione in corso.
   L'LLM utilizza queste informazioni per disambiguare riferimenti come *"quel bug"* o *"questo file"*, producendo un prompt specifico e pronto per l'agente.
4. 🌐 **Toggle lingua di output (pulsante EN)**:
   Di default il prompt perfezionato mantiene la lingua della bozza. Cliccando il pulsante 🌐 **EN** l'output viene forzato in inglese (codice, identificatori e percorsi di file vengono mantenuti invariati).
5. ⚙️ **Integrazione completa nella schermata Plugin di DSH**:
   - Pagina di configurazione dedicata accessibile direttamente dalla schermata **Plugin** di DSH (`plugins.row.config` e `plugins.bundle.config`).
   - Rilevamento dinamico di tutti i modelli configurati nel sistema tramite l'endpoint `GET /dsh-prompt-polish/models`.
   - **Fallback intelligente multi-PC**: In modalità `Automatico`, il plugin si adatta all'istante al modello predefinito presente su qualsiasi computer o installazione di DSH, evitando errori di modello non trovato.
6. 🎨 **4 Stili di riscrittura selezionabili**:
   - **Bilanciato (Balanced)**: Chiaro, professionale e ben strutturato (default).
   - **Conciso (Concise)**: Diretto, essenziale, senza convenevoli.
   - **Dettagliato (Detailed)**: Suddiviso in *Obiettivo*, *Requisiti specifici*, *Vincoli* e *Criteri di accettazione*.
   - **Codice (Code)**: Specializzato per compiti di programmazione (percorsi, edge case, error handling, test).
7. ↩️ **Pulsante Ripristina / Undo immediato**:
   Anche dopo aver accettato la riscrittura, compare un pulsante ↩️ **Ripristina** nella barra strumenti per tornare alla bozza iniziale in caso di ripensamento.
8. ⏹️ **Annullamento istantaneo (Abort/Cancel)**:
   Durante lo streaming, un clic sul pulsante ferma immediatamente la richiesta sia lato client che lato server (`AbortController`).
9. 💅 **Design armonioso con token nativi DSH**:
   Icone vettoriali 16×16 conformi a `@deepseek-ai/dsh-client-ui-primitives`, pulsanti arrotondati ad altezza standard (28px) e hover state coerenti.
10. 🌐 **Supporto multilingua completo (i18n)**:
   Interfaccia in Italiano, Inglese e Cinese in base alla lingua del browser; il modello preserva rigorosamente la lingua di partenza della bozza.

---

## 📥 Installazione

### Metodo A: Installazione da GitHub / npm
```bash
dsh plugin --profile web add dsh-prompt-polish
```

### Metodo B: Aggiunta locale con `dsh plugin`
```bash
dsh plugin --profile web add link:/percorso/a/dsh-prompt-polish
```

Riavvia `dsh web` e ricarica il browser!

---

## ⚙️ Configurazione

Puoi configurare le preferenze del plugin:
11. Nella schermata **Plugin** di DSH (cliccando sul pulsante **Configura** accanto a `dsh-prompt-polish`);
12. Oppure nel file `$DSH_HOME/profiles/web/cordis.patch.yml`:

```yaml
    - id: prompt-polish
      name: dsh-prompt-polish
      provider: auto      # Oppure un provider specifico: proxy, deepseek, ollama, ecc.
      model: auto         # Oppure l'id del modello specifico
      style: balanced     # balanced | concise | detailed | code
      maxTokens: 2000
```

---

## 📄 Licenza

MIT. Consulta il file [LICENSE](./LICENSE).
