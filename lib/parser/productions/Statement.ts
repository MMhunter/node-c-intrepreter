/**
 * rule:
 * statement
 *     <labeled_statement>
 *     <compound_statement>
 *     <expression_statement>
 *     <selection_statement>
 *     <iteration_statement>
 *     <jump_statement>
 */
import {ASTNode, check_rules, NonTerminal, ParsingErrorTerminal, Terminal, TokenStream} from "../Parser";
import {IProductionRule} from "./ProductionRule";
import {TokenType} from "../../lexer/Lexer";
import {LabeledStatement} from "./LabeledStatement";
import {CompoundStatement} from "./CompoundStatement";
import {ExpressionStatement} from "./ExpressionStatement";
import {SelectionStatement} from "./SelectionStatement";
import {IterationStatement} from "./IterationStatement";
import {JumpStatement} from "./JumpStatement";

export class Statement implements IProductionRule {

    public static readonly firstSet = [TokenType.IDENTIFIER, TokenType.CASE, TokenType.DEFAULT, "{", ";", TokenType.CONSTANT, TokenType.STRING_LITERAL, "(", TokenType.INC_OP, TokenType.DEC_OP, "&", "*", "+", "-", "~", "!", TokenType.SIZEOF, TokenType.IF, TokenType.SWITCH, TokenType.WHILE, TokenType.DO, TokenType.FOR, TokenType.GOTO, TokenType.CONTINUE, TokenType.BREAK, TokenType.RETURN];

    public readonly name = "statement";

    public apply(tokenStream: TokenStream, parent: NonTerminal): ASTNode {
        let result = check_rules([new LabeledStatement()], tokenStream, this, parent)
            || check_rules([new CompoundStatement()], tokenStream, this, parent)
            || check_rules([new ExpressionStatement()], tokenStream, this, parent)
            || check_rules([new SelectionStatement()], tokenStream, this, parent)
            || check_rules([new IterationStatement()], tokenStream, this, parent)
            || check_rules([new JumpStatement()], tokenStream, this, parent);

        if (!result){
            // panic error recovery
            let start = tokenStream.currentIndex() + 1;
            if (tokenStream.checkFirst("{")){
                tokenStream.jumpUntil("}");
            }
            else{
                let token = tokenStream.nextToken();
                let compoundStack = [];
                while (token && (!(token.type === ";" || token.type === "}") || compoundStack.length > 0)){
                    if (token.type === "{"){
                        compoundStack.push("{");
                    }
                    else if (token.type === "}"){
                        compoundStack.pop();
                        if (compoundStack.length === 0){
                            break;
                        }
                    }
                    token = tokenStream.nextToken();
                }
            }

            result = new ParsingErrorTerminal(tokenStream.tokens.slice(start, tokenStream.currentIndex()));
        }


        return result;
    }

}
