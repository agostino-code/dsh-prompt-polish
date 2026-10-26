# dsh-prompt-polish (v0.2.1 per DeepSeek Harness 0.2.x)

✨ **DSH Prompt Polish** è un plugin avanzato per l'interfaccia Web di [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness). Aggiunge un pulsante con icona ✨ direttamente nella barra strumenti del compositore per riscrivere ed ottimizzare all'istante la bozza del prompt, rendendola chiara, strutturata ed efficace per il modello AI.

Questo repository è un **fork modernizzato e potenziato** per **DSH 0.2.x** (inclusa la versione `0.2.0-rc.2`).

---

## 🚀 Nuove funzionalità e miglioramenti implementati (v0.2.1)

1. ⚡ **Streaming in tempo reale (Server-Sent Events / SSE)**:
   La generazione non avviene più "al buio": i token riscritti vengono inviati in streaming man mano che il modello li produce. È possibile seguire il testo in tempo reale.
2. 🔍 **Finestra di confronto e revisione "Diff" (Side-by-side)**:
   All'avvio della riscrittura si apre un popover/modale elegante con vista affiancata:
   - **A sinistra**: la tua bozza originale.
   - **A destra**: la versione ottimizzata che si compone in tempo reale.
   - **Pulsanti dedicati**:
     - **Accetta**: scrive la proposta perfezionata direttamente nel box di input.
     - **Rifiuta**: chiude la vista e lascia intatta la tua bozza.
     - **Copia**: copia il testo perfezionato negli appunti senza modificare il box.
3. 🧠 **Consapevolezza del contesto di sessione (Context-Aware Polish)**:
   Un comodo pulsante a pillola **🧠 Contesto** permette di attivare o disattivare l'inclusione del contesto della sessione corrente:
   - Percorso del workspace attivo (`cwd`).
   - Obiettivo attivo (`active goal`).
   - Elenco dei task/todos in corso.
   L'LLM utilizza queste informazioni per disambiguare riferimenti come *"quel bug"* o *"questo file"*, producendo un prompt specifico e pronto per l'agente.
4. 🤖 **Scelta del modello (indipendente dalla sessione)**:
   Puoi far riscrivere il prompt con un modello diverso da quello della sessione (es. modello ultra-rapido come `deepseek-chat` o locale su Ollama) specificando `provider` e `model` in `cordis.patch.yml`. In assenza di configurazione, usa automaticamente il modello predefinito del profilo DSH (`agentDefaultModel`).
5. 🎨 **4 Stili di riscrittura selezionabili**:
   - **Bilanciato (Balanced)**: Chiaro, professionale e ben strutturato (default).
   - **Conciso (Concise)**: Diretto, essenziale, senza convenevoli.
   - **Dettagliato (Detailed)**: Suddiviso in *Obiettivo*, *Requisiti specifici*, *Vincoli* e *Criteri di accettazione*.
   - **Codice (Code)**: Specializzato per compiti di programmazione (percorsi, edge case, error handling, test).
6. ↩️ **Pulsante Ripristina / Undo immediato**:
   Anche dopo aver accettato la riscrittura, compare un pulsante ↩️ **Ripristina** nella barra strumenti per tornare alla bozza iniziale in caso di ripensamento.
7. ⏹️ **Annullamento istantaneo (Abort/Cancel)**:
   Durante lo streaming, un clic sul pulsante ferma immediatamente la richiesta sia lato client che lato server (`AbortController`).
8. 🌐 **Supporto multilingua completo (i18n)**:
   Interfaccia in Italiano, Inglese e Cinese in base alla lingua del browser; il modello preserva rigorosamente la lingua di partenza della bozza.

---

## 📥 Installazione

### Aggiunta locale con `dsh plugin`

Dalla cartella del progetto:

```bash
dsh plugin --profile web add link:D:\DshPolish
```

*(Il prefisso `link:` crea un symlink diretto alla cartella, consentendo aggiornamenti istantanei).*

Poi avvia (o riavvia) la Web UI:

```bash
dsh web
```

Ricarica l'interfaccia nel browser: nella barra dell'input vedrai comparire il pulsante **🧠 Contesto**, il selettore di **Stile** e il pulsante **✨ Perfeziona**!

---

## ⚙️ Configurazione opzionale (`cordis.patch.yml`)

Il plugin funziona subito senza nessuna configurazione. Se vuoi usare un modello dedicato o regolare i parametri:

```yaml
- insert:
    - id: prompt-polish
      name: 'dsh-prompt-polish'
      config:
        style: balanced       # balanced | concise | detailed | code
        maxTokens: 2000       # Limite token generati
        # provider: deepseek-official # Forza un provider specifico (opzionale)
        # model: deepseek-chat        # Forza un modello veloce specifico (opzionale)
```

---

## 📄 Licenza

Distribuito sotto licenza **MIT**. Consulta il file [LICENSE](./LICENSE).
