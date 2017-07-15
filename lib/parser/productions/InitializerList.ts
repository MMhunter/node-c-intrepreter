/**
 * rule:
 * initializer_list
 *     <initializer> <initializer_list_tail>
 */
import {ASTNode, check_rules, NonTerminal, Terminal, TokenStream} from "../Parser";
import {IProductionRule} from "./ProductionRule";
import {TokenType} from "../../lexer/Lexer";

export class InitializerList implements IProductionRule {

    public static readonly firstSet = [TokenType.IDENTIFIER, TokenType.CONSTANT, TokenType.STRING_LITERAL, "(", TokenType.INC_OP, TokenType.DEC_OP, "&", "*", "+", "-", "~", "!", TokenType.SIZEOF, "{"];

    public readonly name = "initializer_list";

    public apply(tokenStream: TokenStream): ASTNode {
        return null;
    }

}
