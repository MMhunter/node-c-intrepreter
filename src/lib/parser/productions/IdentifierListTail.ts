/**
 * rule:
 * identifier_list_tail
 *     , IDENTIFIER <identifier_list_tail>
 *     <empty>
 */
import {ASTNode, check_rules, NonTerminal, Terminal, TokenStream} from "../Parser";
import {IProductionRule} from "./ProductionRule";
import {TokenType} from "../../lexer/Lexer";

export class IdentifierListTail implements IProductionRule {

    public static readonly firstSet = null;

    public readonly name = "identifier_list_tail";

    public apply(tokenStream: TokenStream, parent: NonTerminal): ASTNode {
        if (tokenStream.checkFirst(",")){
            return check_rules([",", TokenType.IDENTIFIER, new IdentifierListTail()], tokenStream, this, parent);
        }
        return check_rules([], tokenStream, this, parent);
    }

}
