/**
 * rule:
 * argument_expression_list
 *     <assignment_expression> <argument_expression_list_tail>
 */
import {ASTNode, check_rules, NonTerminal, Terminal, TokenStream} from "../Parser";
import {IProductionRule} from "./ProductionRule";
import {TokenType} from "../../lexer/Lexer";
import {AssignmentExpression} from "./AssignmentExpression";
import {ArgumentExpressionListTail} from "./ArgumentExpressionListTail";

export class ArgumentExpressionList implements IProductionRule {

    public static readonly firstSet = [TokenType.IDENTIFIER, TokenType.CONSTANT, TokenType.STRING_LITERAL, "(", TokenType.INC_OP, TokenType.DEC_OP, "&", "*", "+", "-", "~", "!", TokenType.SIZEOF];

    public readonly name = "argument_expression_list";

    public apply(tokenStream: TokenStream, parent: NonTerminal): ASTNode {

        if (tokenStream.checkFirst(AssignmentExpression.firstSet)){
            return check_rules([new AssignmentExpression(), new ArgumentExpressionListTail()], tokenStream, this, parent);
        }

        return null;
    }

}
