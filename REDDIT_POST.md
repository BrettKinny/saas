# Reddit Post Drafts — Sopranos as a Service

## Primary draft (meme-y, self-aware)

**Title:**
> I built a Vercel edge function that uses Claude Sonnet to rewrite your PagerDuty alerts as Tony Soprano. It's called SaaS — Sopranos as a Service.

**Body:**
> Hear me out.
>
> Every SaaS product on the planet is now "AI-powered." So I figured — if we're cooking, let's *cook*. I burned actual OpenRouter credits to wire up Claude Sonnet so that when your prod database falls over at 3am, the notification gets rewritten in the voice of a fictional New Jersey crime boss and posted to Discord with a Tenor GIF.
>
> Severity-based color coding. Sentiment analysis to pick which character yells at you. `critical` gets Tony. Paranoid alerts get Paulie. Drama gets Christopher. Old-school gripes get Uncle Junior. Wholesome alerts go to Bobby.
>
> Yes, there's a Deploy to Vercel button. Yes, the README has a demo gif. No, I will not be taking questions about the unit economics.
>
> Whaddya gonna do.
>
> Repo: https://github.com/BrettKinny/saas

---

## Alternate title options

- *"Just when I thought I was out, they pull me back in" — my monitoring stack, after I deployed this*
- *Built a SaaS. Stands for Sopranos as a Service. That's the whole bit.*
- *I spent a weekend so Claude Sonnet could rewrite my Datadog alerts as Paulie Walnuts*
- *We have officially run out of three-letter acronyms*
- *POV: your on-call rotation but every alert is Tony Soprano in a bathrobe*

---

## Where to post

Lead with **r/ProgrammerHumor** — biggest reach, exactly the audience for "look at this dumb thing I shipped." Submit with the demo gif as the media so it autoplays in the feed; the repo link goes in the top comment so the mods don't nuke it for self-promo.

After that, fan it out (space them a day or two apart so it doesn't read as spam):

| Subreddit | Why it fits | Notes |
|---|---|---|
| r/ProgrammerHumor | The tech-meme firehose | Lead with the gif, repo link in a top-level comment |
| r/SideProject | "Look what I built" energy | Frame as a ridiculous weekend project, link OK |
| r/InternetIsBeautiful | Rewards weird, deployable stuff | Needs to be a working live URL, not just a repo |
| r/webdev | Vercel edge function angle | Lean into the stack, less into the meme |
| r/coolgithubprojects | Github-native crowd | Short, repo-forward |
| r/somethingimade | Same vibe, smaller community | Cross-post target |
| r/devops | The on-call/notification angle | Frame around alert fatigue, low-key the bit |
| r/discordapp | It posts to Discord webhooks | Stress the "drop-in webhook" use case |
| r/thesopranos | The fandom itself | **Read the rules first** — they're strict about non-show content; OP'ing a tool may get removed. Safer to comment-link inside an existing thread. |
| r/CirclejerkSopranos | Aggressively on-brand | Recently moderated for off-topic content, lean *hard* into the bit, do not be earnest |
| r/SopranosMemes | Smaller but on-target | Lead with a screenshot of an absurd rewritten alert |

**General self-promo hygiene:** check each sub's sidebar for a self-promo rule (most cap it at ~10% of your activity), don't crosspost the exact same title to every sub on the same day, and don't reply to your own post within the first ~30 minutes — Reddit's spam filter hates it.

---

## Comment to pin under the post (for the dev subs)

> Stack: single Vercel edge function (~400 lines of TS), Claude Sonnet via OpenRouter for sentiment + voice rewrite, Tenor for the gifs, Discord webhook on the receiving end. Falls back to a random character + catchphrase if you don't set an API key, so you can deploy it for free and still get yelled at. Repo: https://github.com/BrettKinny/saas
