/**
 * rule:
 * init_declarator_list
 *     <init_declarator> <init_declarator_list_tail>
 */
import {ASTNode, check_rules, NonTerminal, Terminal, TokenStream} from "../Parser";
import {IProductionRule} from "./ProductionRule";
import {TokenType} from "../../lexer/Lexer";
import {InitDeclarator} from "./InitDeclarator";
import {InitDeclaratorListTail} from "./InitDeclaratorListTail";

export class InitDeclaratorList implements IProductionRule {

    public static readonly firstSet = ["*", TokenType.IDENTIFIER];

    public readonly name = "init_declarator_list";

    public apply(tokenStream: TokenStream, parent: NonTerminal): ASTNode {
        return check_rules([new InitDeclarator(), new InitDeclaratorListTail()], tokenStream, this, parent);
    }

}
