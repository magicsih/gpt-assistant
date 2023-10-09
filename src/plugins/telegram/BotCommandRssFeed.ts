import { Telegraf, Context, Markup } from "telegraf";
import { Update } from "telegraf/types";
import { TelegramPluginBase } from "../../base/TelegramPluginBase.js";
import { telegramCtxHandle } from "../../telegram/index.js";
import Parser from "rss-parser";
import { stripHtml } from "string-strip-html";
import GPT from "../../gpt/index.js";

class BotCommandRssFeed implements TelegramPluginBase {
  register = (bot: Telegraf<Context<Update>>) => {
    bot.command("rss_feed", async (ctx) => {
      return ctx.reply("피드를 고르세요.", {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback("연합뉴스 최신", "rss_feed_yonhapnews"),
            Markup.button.callback("긱뉴스", "rss_feed_geeknews"),
            Markup.button.callback("매경 부동산", "rss_feed_mk_realestate"),
          ],
        ]),
      });
    });

    bot.action(
      "rss_feed_geeknews",
      async (ctx) =>
        await this.handleFeedAction(
          ctx,
          "http://feeds.feedburner.com/geeknews-feed",
          "content",
          false,
          true
        )
    );

    bot.action("rss_feed_mk_realestate", async (ctx) => {
      await this.handleFeedAction(
        ctx,
        "https://www.mk.co.kr/rss/50300009/",
        "content",
        false,
        true
      );
    });

    bot.action("rss_feed_yonhapnews", async (ctx) => {
      await this.handleFeedAction(
        ctx,
        "https://www.yonhapnewstv.co.kr/browse/feed/",
        "content:encoded",
        true
      );
    });
  };

  handleFeedAction = async (
    ctx: any,
    link: string,
    name: string,
    needSummary: boolean,
    needContent: boolean = false
  ) => {
    await ctx.answerCbQuery();
    const sessionId = ctx.update.callback_query.message?.chat.id.toString();
    await telegramCtxHandle(
      ctx,
      ctx.update.callback_query.message?.chat.id,
      ctx.update.callback_query.message?.text,
      "typing",
      async (ctx) => {
        if (needSummary) {
          const { title, summary } = await this.rssFeedWithSummary(
            sessionId,
            link,
            name
          );
          await ctx.replyWithHTML(`[<b>${title}]</b>\n${summary}`);
        } else {
          const { title, articles } = await this.rssFeedWithoutSummary(
            link,
            name
          );
          let html = `<b>[${title}]</b>`;

          for (const i in articles) {
            const article = articles[i];

            let additionalString = `\n${Number(i) + 1}. <a href="${
              article.link
            }">${article.title}</a>`;
            if (needContent) {
              additionalString += `\n${article.content}\n`;
            }

            // if additional html string will be longer than 4k, split it into multiple messages.
            if (html.length + additionalString.length > 4000) {
              await ctx.replyWithHTML(html);
              html = "";
            }

            html += additionalString;
          }

          if (html.length > 0) {
            await ctx.replyWithHTML(html);
          }
        }
      }
    );
  };

  rssFeedWithSummary = async (
    sessionId: string,
    link: string,
    name: string
  ) => {
    const parser = new Parser();
    const feed = await parser.parseURL(link);
    const title = feed.title;

    const contents = [];

    for (const item of feed.items) {
      console.debug(item.title + ":" + item.link);
      const content = stripHtml(item[name]).result;
      contents.push(`[${item.title}]\n${content}`);
    }

    const content = await GPT.completeChatWithoutLTM(
      sessionId,
      "You're a article summarizer.",
      contents.join("\n\n")
    );

    return { title, summary: content };
  };

  rssFeedWithoutSummary = async (link: string, name: string) => {
    const parser = new Parser();
    const feed = await parser.parseURL(link);
    const title = feed.title;

    let articles = [];

    for (const item of feed.items) {
      console.debug(item.title + ":" + item.link);
      articles.push({
        title: item.title,
        link: item.link,
        content: stripHtml(item[name]).result,
      });
    }

    return { title, articles };
  };
}

export default new BotCommandRssFeed();
