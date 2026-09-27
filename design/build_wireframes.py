"""Builds design/wireframes.html: a single self-contained file with every page,
switched by URL hash (#home, #about, #episodes, #episode, #contact, #404).
Home sections and base CSS are taken from wireframe-home.html."""
import base64, re, pathlib

D = pathlib.Path(__file__).parent
src = (D / "wireframe-home.html").read_text()

def uri(name, mime):
    return f"data:{mime};base64," + base64.b64encode((D / "assets" / name).read_bytes()).decode()

LOGO_H = uri("built-west-horizontal.svg", "image/svg+xml")
LOGO_NAVY = uri("built-west-stacked-navy.svg", "image/svg+xml")
TOPO = uri("topo.svg", "image/svg+xml")

base_css = re.search(r"<style>(.*?)</style>", src, re.S).group(1)
grain = re.search(r"\.band::after\{[^}]*url\(([^)]+)\)", base_css).group(1)
home = src[src.index('<section class="hero">'):src.index("<footer>")]
home = home.replace('href="#">Pitch a guest', 'href="#contact">Pitch a guest')

CSS = base_css + f"""
.wf-bar{{background:#fff3b0;color:#3b3200;font:600 12px var(--sans);padding:8px var(--pad);display:flex;gap:18px;flex-wrap:wrap;align-items:center}}
.wf-bar a{{color:#3b3200}} .wf-bar a.on{{text-decoration:underline;text-underline-offset:4px}}
main[data-page]{{display:none}} main[data-page].on{{display:block}}
nav a.on{{text-decoration:underline;text-decoration-color:var(--orange);text-underline-offset:6px}}
.tex{{position:relative;overflow:hidden;background-image:url({TOPO});background-size:cover;background-position:center}}
.tex::after{{content:"";position:absolute;inset:0;background:url({grain});opacity:.07;pointer-events:none}}
.tex>.wrap{{position:relative;z-index:1}}
.navy{{background-color:var(--navy);color:var(--cream)}} .forest{{background-color:var(--forest);color:var(--cream)}}
.navy .eyebrow,.forest .eyebrow{{color:rgba(246,242,233,.7)}}
.page-hero{{padding:clamp(64px,9vw,120px) 0 clamp(40px,5vw,72px)}}
h1.page{{font-size:clamp(44px,6.5vw,96px);line-height:1.02;letter-spacing:-.02em;font-weight:700;margin:20px 0 24px;max-width:22ch}}
.page-hero .lede{{max-width:52ch}}
.split{{display:grid;grid-template-columns:4fr 8fr;gap:64px}}
.split h2{{font-size:clamp(28px,3vw,40px);line-height:1.1;position:sticky;top:100px;align-self:start}}
.prose p{{margin-bottom:1.1em;max-width:62ch;font-size:18px}}
.prose.wide p{{max-width:82ch;font-size:clamp(18px,1.4vw,20px)}}
.why{{font-size:clamp(30px,3.4vw,48px);line-height:1.1;margin-bottom:28px}}
.rows .row{{display:grid;grid-template-columns:90px 1fr 1.4fr;gap:32px;padding:30px 0;border-top:1px solid rgba(11,31,45,.15);align-items:baseline}}
.rows .row:last-child{{border-bottom:1px solid rgba(11,31,45,.15)}}
.row .num{{font:700 13px var(--sans);letter-spacing:.2em;color:var(--coastal)}}
.row h3{{font-size:clamp(22px,2.2vw,30px);line-height:1.15}}
.host{{display:grid;grid-template-columns:5fr 7fr;gap:72px;align-items:center}}
.host h2{{font-size:clamp(34px,4vw,56px);line-height:1.05;margin:16px 0 24px}}
.quote{{font-size:clamp(30px,4.4vw,60px);line-height:1.1;font-style:italic;font-weight:600;max-width:none}}
.quote::before{{content:"\\201C";color:var(--orange);margin-right:.05em}}
.cite{{margin-top:28px}}
.pill{{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 16px;border:1px solid currentColor;border-radius:999px;font:600 13px var(--sans);color:inherit;text-decoration:none;opacity:.9}}
.pills{{display:flex;flex-wrap:wrap;gap:10px}}
.empty{{border-radius:4px;padding:clamp(40px,6vw,80px)}}
.empty h2{{font-size:clamp(30px,4vw,52px);line-height:1.08;margin:18px 0 28px;max-width:28ch}}
.empty form.signup input,.navy form.signup input,.forest form.signup input{{border-color:var(--cream);color:var(--cream)}}
.empty form.signup input::placeholder,.navy form.signup input::placeholder{{color:rgba(246,242,233,.55)}}
.divider-label{{display:flex;align-items:center;gap:16px;margin:clamp(64px,8vw,112px) 0 32px;color:var(--coastal)}}
.divider-label::after{{content:"";flex:1;height:1px;background:rgba(11,31,45,.15)}}
.feature{{display:grid;grid-template-columns:5fr 7fr;gap:56px;align-items:center;padding-bottom:56px}}
.feature h2{{font-size:clamp(32px,4vw,56px);line-height:1.05;margin:16px 0 20px}}
.ep-row{{display:grid;grid-template-columns:110px 1fr 160px 48px;gap:32px;align-items:center;padding:28px 0;border-top:1px solid rgba(11,31,45,.15);color:var(--navy);text-decoration:none}}
.ep-row:hover h3{{text-decoration:underline;text-decoration-color:var(--orange);text-underline-offset:6px}}
.ep-row .n{{font:700 clamp(36px,3.4vw,48px)/1 var(--serif);color:var(--sage)}}
.ep-row h3{{font-size:clamp(22px,2.2vw,28px);line-height:1.15;margin-bottom:6px}}
.ep-row .when{{font:500 14px var(--sans);color:var(--coastal)}}
.play{{width:48px;height:48px;border-radius:50%;border:1.5px solid currentColor;display:grid;place-items:center}}
.play::before{{content:"";border-left:12px solid currentColor;border-top:8px solid transparent;border-bottom:8px solid transparent;margin-left:4px}}
.ep-hero .wrap{{display:grid;grid-template-columns:7fr 4fr;gap:72px;align-items:center}}
.ep-hero h1{{font-size:clamp(38px,5vw,72px);line-height:1.04;letter-spacing:-.015em;margin:20px 0 24px}}
.ep-hero .meta{{color:rgba(246,242,233,.8)}}
.guestline{{font:600 18px var(--sans);margin-bottom:6px}}
.ep-hero .portrait{{background:repeating-linear-gradient(135deg,#243746 0 12px,#1d3140 12px 24px);color:rgba(246,242,233,.6)}}
.player{{background:var(--navy);color:var(--cream);border-radius:4px;padding:24px 28px;display:flex;align-items:center;gap:24px}}
.player .play{{flex:none;background:var(--cream);color:var(--navy);border:0}}
.bar{{flex:1;height:4px;background:rgba(246,242,233,.2);border-radius:2px;position:relative}}
.bar::before{{content:"";position:absolute;inset:0 72% 0 0;background:var(--orange);border-radius:2px}}
.time{{font:500 13px var(--sans);color:rgba(246,242,233,.7);white-space:nowrap}}
.listen{{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:20px}}
.ep-body{{display:grid;grid-template-columns:8fr 4fr;gap:72px}}
.ep-body aside{{position:sticky;top:100px;align-self:start}}
.card{{background:var(--card);border:1px solid rgba(11,31,45,.08);border-radius:4px;padding:28px}}
.card+.card{{margin-top:20px}}
h2.sub{{font:600 13px var(--sans);letter-spacing:.2em;text-transform:uppercase;margin:56px 0 20px}}
.chapters li{{display:grid;grid-template-columns:72px 1fr;padding:12px 0;border-top:1px solid rgba(11,31,45,.1);list-style:none}}
.chapters{{padding:0}}
.chapters b{{font:600 14px var(--sans);color:var(--coastal)}}
.inline-quote{{border-left:3px solid var(--orange);padding:4px 0 4px 28px;margin:48px 0;font:600 italic clamp(24px,2.6vw,34px)/1.25 var(--serif)}}
details{{border-top:1px solid rgba(11,31,45,.15);border-bottom:1px solid rgba(11,31,45,.15);padding:20px 0;margin-top:56px}}
summary{{font:600 13px var(--sans);letter-spacing:.2em;text-transform:uppercase;cursor:pointer}}
.prevnext{{display:grid;grid-template-columns:1fr 1fr;gap:24px;border-top:1px solid rgba(11,31,45,.15);padding-top:32px}}
.prevnext a{{color:var(--navy);text-decoration:none}} .prevnext a:last-child{{text-align:right}}
.prevnext h3{{font-size:22px;margin-top:10px}}
.cards3{{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;margin-top:32px}}
.cards3 a{{color:var(--navy);text-decoration:none}}
.cards3 h3{{font-size:24px;line-height:1.15;margin:14px 0 6px}}
.contact{{display:grid;grid-template-columns:7fr 4fr;gap:80px}}
.seg{{display:inline-flex;border:1px solid var(--navy);border-radius:2px;margin-bottom:40px}}
.seg button{{height:44px;padding:0 20px;border:0;background:transparent;font:600 12px var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--navy);cursor:pointer}}
.seg button.on{{background:var(--navy);color:var(--cream)}}
.field{{margin-bottom:28px}}
.field label{{display:block;font:600 12px var(--sans);letter-spacing:.16em;text-transform:uppercase;margin-bottom:8px}}
.field input,.field textarea{{width:100%;border:0;border-bottom:1.5px solid var(--navy);background:transparent;font:400 17px var(--sans);color:var(--navy);padding:10px 2px}}
.field textarea{{min-height:120px;resize:vertical;border:1.5px solid var(--navy);border-radius:2px;padding:12px}}
.field input:focus,.field textarea:focus{{outline:2px solid var(--orange);outline-offset:3px}}
.two{{display:grid;grid-template-columns:1fr 1fr;gap:28px}}
.lost{{min-height:72vh;display:flex;align-items:center}} .lost .wrap{{width:100%}}
.lost h1{{font-size:clamp(56px,10vw,150px);line-height:.95;letter-spacing:-.03em;margin:20px 0 24px}}
@media (max-width:960px){{
 .split,.host,.feature,.ep-hero .wrap,.ep-body,.contact,.cards3,.two{{grid-template-columns:1fr}}
 .split h2,.ep-body aside{{position:static}}
 .rows .row{{grid-template-columns:1fr;gap:8px}}
 .ep-row{{grid-template-columns:56px 1fr 40px;gap:16px}} .ep-row .when{{display:none}} .play{{width:40px;height:40px}}
 .ep-hero .portrait{{order:-1;max-width:260px}}
 .player{{flex-wrap:wrap}} .prevnext{{grid-template-columns:1fr}} .prevnext a:last-child{{text-align:left}}
}}
"""

def note(text, top="24px", right="24px"):
    return f'<div class="note" style="top:{top};right:{right}">{text}</div>'

def portrait(label="GUEST PORTRAIT 4:5"):
    return f'<div class="portrait">{label}</div>'

ARROW = '<span class="arrow"></span>'
PITCH = f'''<section class="pitch forest"><div class="wrap"><p class="eyebrow">Know someone?</p>
<h2 class="serif">Who in BC tech is worth an hour?</h2><a class="btn inv" href="#contact">Pitch a guest {ARROW}</a></div></section>'''
SIGNUP = f'''<form class="signup" onsubmit="event.preventDefault();this.outerHTML='<p class=&quot;lede&quot; style=&quot;margin-top:28px&quot;><strong>You’re on the list.</strong> We’ll email when episode one is live.</p>'">
<input type="email" required placeholder="you@company.com" aria-label="Email address"><button class="btn inv" type="submit">Get notified {ARROW}</button></form>'''

ABOUT = f'''
<section class="page-hero rel">{note("About · Big editorial title, lede. Cream, no photo: the host section below carries the imagery.")}
<div class="wrap"><p class="eyebrow">About the show</p>
<h1 class="serif page">The story of BC tech, told by the people building it.</h1>
<p class="lede">Built West is a long-form interview podcast. One guest, one unhurried conversation, recorded in person wherever possible.</p></div></section>

<section class="rel" style="padding-top:0"><div class="wrap">
<h2 class="serif why">Why Built West</h2>
<div class="prose wide">
<p>British Columbia has been quietly building serious technology companies for decades. Most of the stories behind them never get told, or get squeezed into a panel slot and a press release.</p>
<p>Built West is the long version. We sit down with founders, operators and investors and talk about how things actually got built: the early calls, the near misses, the decisions that looked obvious only afterwards.</p>
<p>No hot takes, no pitch decks. Just good conversations with people worth listening to. [Placeholder copy — Matt to finalise.]</p>
</div></div></section>

<section class="band tex navy rel">{note("Navy textured band · pull quote from Matt (host).")}
<div class="wrap"><p class="eyebrow">The idea</p>
<p class="serif quote">The best conversations happen in the room, with time to go somewhere unexpected.</p>
<p class="eyebrow cite">— Matt Vaillant, Host</p></div></section>

<section class="rel">{note("Format · numbered rows with hairlines, magazine table-of-contents feel.")}
<div class="wrap"><p class="eyebrow" style="margin-bottom:24px">How it works</p>
<div class="rows">
<div class="row"><span class="num">01</span><h3 class="serif">One guest</h3><p>No panels and no co-hosts talking over each other. The whole hour belongs to the guest.</p></div>
<div class="row"><span class="num">02</span><h3 class="serif">Recorded in person</h3><p>Face to face across BC wherever possible, because it makes for a better conversation.</p></div>
<div class="row"><span class="num">03</span><h3 class="serif">Long form</h3><p>About an hour. Long enough to get past the talking points.</p></div>
<div class="row"><span class="num">04</span><h3 class="serif">Every episode, everywhere</h3><p>Audio on Apple Podcasts and Spotify, full video on YouTube, transcripts here.</p></div>
</div></div></section>

<section class="rel" style="padding-top:0">{note("Host · portrait left, bio right. Needs host photo and bio.", "0")}
<div class="wrap host">{portrait("HOST PORTRAIT 4:5")}
<div><p class="eyebrow" style="color:var(--coastal)">Your host</p>
<h2 class="serif">[Host name]</h2>
<div class="rule"></div>
<div class="prose"><p>[Short bio: who you are, your connection to BC tech, and why you started the show. Two or three sentences.]</p>
<p>[Optional second paragraph.]</p></div>
<div class="pills" style="margin-top:20px"><a class="pill" href="#">LinkedIn</a><a class="pill" href="#">Email</a></div>
</div></div></section>
{PITCH}'''

EPISODES = f'''
<section class="page-hero rel">{note("Episodes · page title + where to listen (links go live at launch).")}
<div class="wrap"><p class="eyebrow">Episodes</p>
<h1 class="serif page">Every conversation.</h1>
<p class="lede">New episodes on Apple Podcasts, Spotify and YouTube. Show notes and full transcripts here.</p>
<div class="pills" style="margin-top:28px"><a class="pill" href="#">Apple Podcasts</a><a class="pill" href="#">Spotify</a><a class="pill" href="#">YouTube</a><a class="pill" href="#">RSS</a></div>
</div></section>

<section class="rel" style="padding-top:0"><div class="wrap">
<div class="empty tex navy rel">{note("AT LAUNCH · empty state: textured navy panel + signup.", "16px", "16px")}
<p class="eyebrow">Coming soon</p>
<h2 class="serif">The first conversations are being recorded now.</h2>
{SIGNUP}
<p class="micro" style="color:rgba(246,242,233,.7)">One email when the first episode drops. Nothing else.</p>
</div>

<p class="eyebrow divider-label">Preview · after launch</p>
<a class="feature" href="#episode" style="color:var(--navy);text-decoration:none">{portrait()}
<div><p class="eyebrow" style="color:var(--coastal)">Latest · Episode 03 · 58 min</p>
<h2 class="serif">[Episode title, six words max]</h2><div class="rule"></div>
<p class="meta">[Guest name] · [Role, Company]</p><span class="btn">Play episode {ARROW}</span></div></a>
<div class="rel">{note("List rows: big sage number, title, guest, date, play. Scales to 100+ episodes; add filters later.", "-44px")}
<a class="ep-row" href="#episode"><span class="n">02</span><div><h3 class="serif">[Episode title]</h3><p class="meta" style="margin:0">[Guest name] · [Role, Company]</p></div><span class="when">14 Nov 2026 · 61 min</span><span class="play"></span></a>
<a class="ep-row" href="#episode"><span class="n">01</span><div><h3 class="serif">[Episode title]</h3><p class="meta" style="margin:0">[Guest name] · [Role, Company]</p></div><span class="when">31 Oct 2026 · 54 min</span><span class="play"></span></a>
</div></div></section>'''

EPISODE = f'''
<section class="ep-hero tex navy rel" style="padding:clamp(56px,8vw,112px) 0">{note("Episode · the signature pattern: eyebrow, title, orange rule, guest line.")}
<div class="wrap"><div>
<p class="eyebrow">Episode 03 · 28 Nov 2026 · 58 min</p>
<h1 class="serif">[Episode title in the display serif, up to two lines]</h1>
<div class="rule"></div>
<p class="guestline">[Guest name]</p><p class="meta">[Role, Company]</p>
<a class="btn inv" href="#player">Play episode {ARROW}</a></div>
{portrait()}</div></section>

<section id="player" style="padding:48px 0 0"><div class="wrap rel">{note("Riverside embed sits inside this navy panel so it always looks on-brand.", "-36px", "0")}
<div class="player"><span class="play"></span><div class="bar"></div><span class="time">16:24 / 58:10</span></div>
<div class="listen"><span class="eyebrow" style="color:var(--coastal)">Listen on</span><a class="pill" href="#">Apple Podcasts</a><a class="pill" href="#">Spotify</a><a class="pill" href="#">YouTube</a></div>
</div></section>

<section style="padding-top:64px"><div class="wrap ep-body">
<div class="prose">
<p class="lede" style="max-width:none">[Two or three sentence summary of the conversation: who the guest is, what they built, and the thread that runs through the episode.]</p>
<h2 class="sub">In this episode</h2>
<ul class="chapters">
<li><b>00:00</b><span>[Chapter title]</span></li><li><b>04:12</b><span>[Chapter title]</span></li>
<li><b>17:45</b><span>[Chapter title]</span></li><li><b>33:08</b><span>[Chapter title]</span></li><li><b>51:30</b><span>[Chapter title]</span></li></ul>
<blockquote class="inline-quote">[A standout line from the guest goes here as a pull quote.]</blockquote>
<h2 class="sub">Mentioned</h2>
<p>[Company] · [Book] · [Article] · [Person]</p>
<details><summary>Full transcript</summary><div style="padding-top:20px"><p><b>[Host]:</b> [Transcript text…]</p><p><b>[Guest]:</b> [Transcript text…]</p></div></details>
</div>
<aside class="rel">
<div class="card"><p class="eyebrow" style="color:var(--coastal)">About the guest</p><h3 class="serif" style="font-size:26px;margin:14px 0 10px">[Guest name]</h3><p style="font-size:15px">[Short bio. Role, company, what they're known for.]</p><div class="pills" style="margin-top:18px"><a class="pill" href="#">LinkedIn</a><a class="pill" href="#">Website</a></div></div>
<div class="card"><p class="eyebrow" style="color:var(--coastal)">Share</p><div class="pills" style="margin-top:14px"><a class="pill" href="#">Copy link</a><a class="pill" href="#">LinkedIn</a><a class="pill" href="#">X</a></div></div>
</aside></div></section>

<section style="padding-top:0"><div class="wrap">
<div class="prevnext"><a href="#episode"><p class="eyebrow" style="color:var(--coastal)">← Previous · Episode 02</p><h3 class="serif">[Episode title]</h3></a>
<a href="#episode"><p class="eyebrow" style="color:var(--coastal)">Next · Episode 04 →</p><h3 class="serif">[Episode title]</h3></a></div>
<p class="eyebrow divider-label" style="margin-top:96px">More episodes</p>
<div class="cards3">''' + "".join(f'''<a href="#episode">{portrait()}<h3 class="serif">[Episode title]</h3><p class="meta" style="margin:0">Episode 0{n} · [Guest name]</p></a>''' for n in (2, 1, 4)) + f'''</div></div></section>
<section class="band tex navy"><div class="wrap"><p class="eyebrow">Never miss one</p><p class="serif statement" style="font-size:clamp(30px,4vw,56px)">New conversations, straight to your inbox.</p><div style="margin-top:32px">{SIGNUP}</div></div></section>'''

CONTACT = f'''
<section class="page-hero rel">{note("Contact · pitching a guest is the default tab.")}
<div class="wrap"><p class="eyebrow">Contact</p><h1 class="serif page">Get in touch.</h1>
<p class="lede">Know someone who should be on the show? Tell us about them. For anything else, pick the other tab.</p></div></section>
<section style="padding-top:0"><div class="wrap contact">
<div>
<div class="seg" role="tablist"><button class="on" data-f="pitch">Pitch a guest</button><button data-f="general">Something else</button></div>
<form data-form="pitch" onsubmit="event.preventDefault();this.outerHTML='<p class=&quot;lede&quot;><strong>Thanks.</strong> We read every one.</p>'">
<div class="two"><div class="field"><label>Your name</label><input required></div><div class="field"><label>Your email</label><input type="email" required></div></div>
<div class="two"><div class="field"><label>Guest name</label><input required></div><div class="field"><label>Role and company</label><input></div></div>
<div class="field"><label>Why are they worth an hour?</label><textarea required></textarea></div>
<div class="field"><label>Link (optional)</label><input placeholder="LinkedIn, website, article"></div>
<button class="btn">Send pitch {ARROW}</button></form>
<form data-form="general" style="display:none" onsubmit="event.preventDefault();this.outerHTML='<p class=&quot;lede&quot;><strong>Thanks.</strong> We’ll be in touch.</p>'">
<div class="two"><div class="field"><label>Your name</label><input required></div><div class="field"><label>Your email</label><input type="email" required></div></div>
<div class="field"><label>Message</label><textarea required></textarea></div>
<button class="btn">Send message {ARROW}</button></form>
</div>
<aside><div class="card"><p class="eyebrow" style="color:var(--coastal)">Direct</p><p style="margin:12px 0 24px"><a href="#" style="color:var(--navy)">hello@builtwest.ca</a></p>
<p class="eyebrow" style="color:var(--coastal)">Follow</p><div class="pills" style="margin-top:12px"><a class="pill" href="#">LinkedIn</a><a class="pill" href="#">Instagram</a><a class="pill" href="#">YouTube</a></div>
<p class="micro" style="margin-top:28px">Sponsorship and partnership enquiries welcome.</p></div></aside>
</div></section>'''

LOST = f'''
<section class="lost tex navy"><div class="wrap"><p class="eyebrow">404</p>
<h1 class="serif">Wrong turn.</h1><p class="lede" style="color:rgba(246,242,233,.85)">This page doesn't exist. Head west instead.</p>
<div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:36px"><a class="btn inv" href="#home">Home {ARROW}</a><a class="btn" style="border:1px solid var(--cream)" href="#episodes">Episodes</a></div>
</div></section>'''

PAGES = [("home", "Home", home), ("about", "About", ABOUT), ("episodes", "Episodes", EPISODES),
         ("episode", "Episode", EPISODE), ("contact", "Contact", CONTACT), ("404", "404", LOST)]

bar = '<div class="wf-bar">WIREFRAME PAGES:' + "".join(f'<a href="#{k}">{t}</a>' for k, t, _ in PAGES) + "</div>"
header = f'''<header><div class="wrap"><a href="#home"><img src="{LOGO_H}" alt="Built West — A BC Tech Podcast"></a>
<nav><a href="#episodes">Episodes</a><a href="#about">About</a><a href="#contact">Contact</a><a class="btn" href="#home">Get notified {ARROW}</a><button class="menu">Menu</button></nav></div></header>'''
footer = src[src.index("<footer>"):src.index("</footer>") + 9]
footer = re.sub(r'<a href="#">(Episodes|About|Pitch a guest|Contact)</a>',
                lambda m: f'<a href="#{ {"Episodes":"episodes","About":"about","Pitch a guest":"contact","Contact":"contact"}[m.group(1)] }">{m.group(1)}</a>', footer)
mains = "".join(f'<main data-page="{k}">{body}</main>' for k, _, body in PAGES)
JS = """<script>
function show(h){if(!document.querySelector('main[data-page="'+h+'"]'))h='home';
document.querySelectorAll('main[data-page]').forEach(function(m){m.classList.toggle('on',m.dataset.page===h)});
document.querySelectorAll('.wf-bar a,nav a').forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+h)});window.scrollTo(0,0)}
document.addEventListener('click',function(e){var a=e.target.closest('a[href^="#"]');if(!a)return;var k=a.getAttribute('href').slice(1);
if(document.querySelector('main[data-page="'+k+'"]')){e.preventDefault();show(k)}});
show((location.hash||'#home').slice(1));
document.querySelectorAll('.seg button').forEach(function(b){b.onclick=function(){document.querySelectorAll('.seg button').forEach(function(x){x.classList.toggle('on',x===b)});
document.querySelectorAll('[data-form]').forEach(function(f){f.style.display=f.dataset.form===b.dataset.f?'':'none'})}});
</script>"""
html = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Built West Wireframes</title>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,600;0,8..60,700;1,8..60,600&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body>{bar}{header}{mains}{footer}{JS}</body></html>'''
(D / "wireframes.html").write_text(html)
print("wrote", D / "wireframes.html", len(html))
