/**
 * rule:
 * relational_expression
 *     <shift_expression> <relational_expression_tail>
 */
import {ASTNode, check_rules, NonTerminal, Terminal, TokenStream} from "../Parser";
import {IProductionRule} from "./ProductionRule";
import {TokenType} from "../../lexer/Lexer";
import {ShiftExpression} from "./ShiftExpression";
import {RelationalExpressionTail} from "./RelationalExpressionTail";

export class RelationalExpression implements IProductionRule {

    public static readonly firstSet = [TokenType.IDENTIFIER, TokenType.CONSTANT, TokenType.STRING_LITERAL, "(", TokenType.INC_OP, TokenType.DEC_OP, "&", "*", "+", "-", "~", "!", TokenType.SIZEOF];

    public readonly name = "relational_expression";

    public apply(tokenStream: TokenStream, parent: NonTerminal): ASTNode {
        return check_rules([new ShiftExpression(), new RelationalExpressionTail()], tokenStream, this, parent);
    }

}
