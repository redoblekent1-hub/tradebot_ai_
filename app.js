const pairs=[["EUR","USD"],["GBP","USD"],["USD","JPY"],["AUD","USD"],["USD","CAD"],["USD","CHF"],["NZD","USD"]];
const agentInfo=[
["Scanner","Checks the selected currency pairs for available reference rates."],
["Trend Analyzer","Compares the latest daily reference rate with the previous available rate."],
["News Analyzer","Not connected yet. Add a trusted economic-calendar provider on the server."],
["Signal Evaluator","Produces WAIT by default; one daily change is not enough for a reliable trade signal."],
["Risk Analyzer","Flags missing intraday data, spread, volatility and broker execution information."],
["Performance Tracker","Ready for a separately validated backtest; no win rate is invented."]
];
const $=id=>document.getElementById(id);
function renderAgents(){ $("agents").innerHTML=agentInfo.map(([n,d])=>`<article class="agent"><b>${n}</b><p>${d}</p></article>`).join("");}
async function load(){
 $("connection").textContent="Fetching rates…"; $("dataStatus").textContent="Loading";
 try{
  const res=await fetch("https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,JPY,AUD,CAD,CHF,NZD");
  if(!res.ok) throw new Error("Rate provider unavailable");
  const latest=await res.json();
  const prevRes=await fetch("https://api.frankfurter.app/"+previousBusinessDay(latest.date)+"?from=USD&to=EUR,GBP,JPY,AUD,CAD,CHF,NZD");
  const previous=prevRes.ok?await prevRes.json():null;
  const rows=pairs.map(([base,quote])=>{
    const usdRates=latest.rates; let rate;
    if(base==="USD") rate=usdRates[quote];
    else if(quote==="USD") rate=1/usdRates[base];
    else rate=usdRates[quote]/usdRates[base];
    let old=null;
    if(previous?.rates){old=base==="USD"?previous.rates[quote]:quote==="USD"?1/previous.rates[base]:previous.rates[quote]/previous.rates[base];}
    const pct=old?((rate-old)/old)*100:null;
    return {base,quote,rate,pct};
  });
  $("pairs").innerHTML=rows.map(x=>`<article class="pair"><div class="pair-top"><b>${x.base}/${x.quote}</b><span class="signal">REFERENCE FX</span></div><div class="rate">${x.rate.toFixed(x.quote==="JPY"?3:5)}</div><div class="muted">${x.pct===null?"Previous-day comparison unavailable":`Daily change: ${x.pct>=0?"+":""}${x.pct.toFixed(3)}%`}</div><div class="signal">Analysis: WAIT · Insufficient intraday confirmation</div></article>`).join("");
  $("connection").textContent="Reference data connected";$("dataStatus").textContent="Available";$("updated").textContent=latest.date;
 }catch(e){$("connection").textContent="Data unavailable";$("dataStatus").textContent="Offline";$("pairs").innerHTML=`<div class="loading">Could not load rates. Check your connection and refresh. (${e.message})</div>`;}
}
function previousBusinessDay(date){const d=new Date(date+"T12:00:00Z");d.setUTCDate(d.getUTCDate()-1);return d.toISOString().slice(0,10);}
$("refresh").addEventListener("click",load);renderAgents();load();
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}));
