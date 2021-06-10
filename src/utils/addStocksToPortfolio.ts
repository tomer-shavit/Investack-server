import { Request } from "express";
import Stock from "../entities/Stock";
import Portfolio from "../entities/Portfolio";

export const addStocksToPortfolio = async (req: Request, stocks: Stock[]) => {
  const { userId } = req.session;
  const portfolio = await Portfolio.findOne(
    { userId },
    { relations: ["stocks"] }
  );

  if (!portfolio) {
    console.log("No portfolio was found");
    return;
    //do nothing
  }
  const ownedStocks = stocksArrToMap(portfolio.stocks);

  stocks.forEach(async (stock) => {
    if (stock.symbol in ownedStocks) {
      ownedStocks[stock.symbol].amount += stock.amount;
      ownedStocks[stock.symbol].value += stock.value;
      await Stock.update(
        { portfolioId: portfolio.id, symbol: stock.symbol },
        {
          amount: ownedStocks[stock.symbol].amount,
          value: ownedStocks[stock.symbol].value,
        }
      );
    } else {
      await Stock.create({
        symbol: stock.symbol,
        amount: stock.amount,
        value: stock.value,
        portfolioId: portfolio.id,
      }).save();
    }
  });
};

const stocksArrToMap = (stocks: Stock[]) => {
  const dict: any = {};
  stocks.forEach((stock) => {
    dict[stock.symbol] = { amount: stock.amount, value: stock.value };
  });

  return dict;
};
