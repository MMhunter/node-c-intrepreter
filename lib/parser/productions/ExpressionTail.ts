/**
 * rule:
 * expression_tail
 *     , <assignment_expression> <expression_tail>
 *     <empty>
 */
import {ASTNode, check_rules, NonTerminal, Terminal, TokenStream} from "../Parser";
import {IProductionRule} from "./ProductionRule";
import {TokenType} from "../../lexer/Lexer";

export class ExpressionTail implements IProductionRule {

    public static readonly firstSet = null;

    public readonly name = "expression_tail";

    public apply(tokenStream: TokenStream): ASTNode {
        return null;
    }

}
