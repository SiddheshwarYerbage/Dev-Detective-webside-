// Dev Detective - simple client-side code inspector
(function(){
	const codeInput = document.getElementById('code-input');
	const detectBtn = document.getElementById('detect-btn');
	const clearBtn = document.getElementById('clear-btn');
	const sampleBtn = document.getElementById('sample-btn');
	const resultsEl = document.getElementById('results');

	function detectIssues(code){
		const lines = code.replace(/\r/g,'').split('\n');
		const findings = [];

		// counts
		let todoCount = 0, fixmeCount = 0, consoleCount = 0, longLines = 0, trailing = 0;

		lines.forEach((ln, i) => {
			const num = i+1;
			if(/\bTODO\b/i.test(ln)) { todoCount++; findings.push({type:'TODO',line:num,text:ln.trim(),importance:'high'}); }
			if(/\bFIXME\b/i.test(ln)) { fixmeCount++; findings.push({type:'FIXME',line:num,text:ln.trim(),importance:'high'}); }
			if(/console\.(log|warn|error)\s*\(/i.test(ln)) { consoleCount++; findings.push({type:'console',line:num,text:ln.trim(),importance:'medium'}); }
			if(ln.replace(/\t/g,'    ').length > 120){ longLines++; findings.push({type:'long-line',line:num,text:ln.trim(),importance:'low'}); }
			if(/\s+$/.test(ln)) { trailing++; findings.push({type:'trailing-space',line:num,text:ln.trim(),importance:'low'}); }
		});

		// language heuristics
		let language = 'Unknown';
		const trimmed = code.trim();
		if(/<\s*html|<\s*div|<!DOCTYPE html>/i.test(trimmed)) language = 'HTML';
		else if(/^[\s\S]*\{[\s\S]*\}|function\s+|=>|const\s+|let\s+/m.test(trimmed)) language = 'JavaScript';
		else if(/^[\s\S]*:[\s\S]*;|@media|display\s*:/m.test(trimmed)) language = 'CSS';

		return {language,counts:{todo:todoCount,fixme:fixmeCount,console:consoleCount,longLines,trailing},findings};
	}

	function renderResult(report){
		resultsEl.innerHTML = '';
		const meta = document.createElement('div');
		meta.className = 'meta';
		meta.innerHTML = `<div><span class="badge">Language: ${report.language}</span> <span class="badge">TODO: ${report.counts.todo}</span> <span class="badge">FIXME: ${report.counts.fixme}</span> <span class="badge">console: ${report.counts.console}</span> <span class="badge">Long: ${report.counts.longLines}</span></div>`;
		resultsEl.appendChild(meta);

		if(report.findings.length === 0){
			const ok = document.createElement('div');
			ok.className = 'finding';
			ok.textContent = 'No issues detected — good job!';
			resultsEl.appendChild(ok);
			return;
		}

		// group by importance then show sample entries
		report.findings.slice(0,200).forEach(f => {
			const d = document.createElement('div');
			d.className = 'finding' + (f.importance === 'high' ? ' important' : '');
			d.innerHTML = `<strong>${f.type}</strong> <span class="meta">(line ${f.line})</span><div style="margin-top:6px;font-family:monospace;font-size:0.95rem;color:#dfe9f2;white-space:pre-wrap">${escapeHtml(f.text)}</div>`;
			resultsEl.appendChild(d);
		});

		// suggestions
		const sug = document.createElement('div');
		sug.style.marginTop = '12px';
		sug.innerHTML = `<strong>Recommendations</strong><ul class="meta"><li>Remove or guard console.* calls before production.</li><li>Address TODO/FIXME items or create tracked issues.</li><li>Break long lines or wrap for readability.</li><li>Remove trailing whitespace to keep diffs clean.</li></ul>`;
		resultsEl.appendChild(sug);
	}

	function escapeHtml(s){
		return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	}

	detectBtn.addEventListener('click', ()=>{
		const code = codeInput.value || '';
		if(!code.trim()){ resultsEl.innerHTML = '<div class="meta">Paste some code first.</div>'; return; }
		const report = detectIssues(code);
		renderResult(report);
	});

	clearBtn.addEventListener('click', ()=>{ codeInput.value=''; resultsEl.innerHTML='No analysis yet.'; });

	sampleBtn.addEventListener('click', ()=>{
		const sample = `// TODO: refactor this function\nfunction greet(name){\n    console.log('hello', name);    \n}\n\n/* FIXME: using global */\nconst x = 1;    \n`;
		codeInput.value = sample;
	});

	// support Ctrl+Enter to run
	codeInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' && (e.ctrlKey || e.metaKey)){ detectBtn.click(); } });

})();

