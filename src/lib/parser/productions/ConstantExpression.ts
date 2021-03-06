/**
 * rule:
 * constant_expression
 *     <conditional_expression>
 */
import {ASTNode, check_rules, NonTerminal, Terminal, TokenStream} from "../Parser";
import {IProductionRule} from "./ProductionRule";
import {TokenType} from "../../lexer/Lexer";
import {ConditionalExpression} from "./ConditionalExpression";

export class ConstantExpression implements IProductionRule {

    public static readonly firstSet = [TokenType.IDENTIFIER, TokenType.CONSTANT, TokenType.STRING_LITERAL, "(", TokenType.INC_OP, TokenType.DEC_OP, "&", "*", "+", "-", "~", "!", TokenType.SIZEOF];

    public readonly name = "constant_expression";

    public apply(tokenStream: TokenStream, parent: NonTerminal): ASTNode {
        if (tokenStream.checkFirst(ConditionalExpression.firstSet)){
            return check_rules([new ConditionalExpression()], tokenStream, this, parent);
        }
        return null;
    }

}
