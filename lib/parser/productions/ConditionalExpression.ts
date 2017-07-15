/**
 * rule:
 * conditional_expression
 *     <logical_or_expression>
 *     <logical_or_expression> ? <expression> : <conditional_expression>
 */
import {ASTNode, check_rules, NonTerminal, Terminal, TokenStream} from "../Parser";
import {IProductionRule} from "./ProductionRule";
import {TokenType} from "../../lexer/Lexer";

export class ConditionalExpression implements IProductionRule {

    public static readonly firstSet = [TokenType.IDENTIFIER, TokenType.CONSTANT, TokenType.STRING_LITERAL, "(", TokenType.INC_OP, TokenType.DEC_OP, "&", "*", "+", "-", "~", "!", TokenType.SIZEOF];

    public readonly name = "conditional_expression";

    public apply(tokenStream: TokenStream): ASTNode {
        return null;
    }

}
