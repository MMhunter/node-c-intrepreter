
import {IProductionRule} from "./productions/ProductionRule";
import {Token, TokenType} from "../lexer/Lexer";
import {TranslationUnit} from "./productions/TranslationUnit";
/**
 * @file Parser.class.js
 *
 * Created by mmhunter on 09/07/2017.
 */

export class Parser {

    public ASTRoot: NonTerminal;
    public tokens: TokenStream;
    public rootRule: IProductionRule;

    constructor(tokens: Token[], rootRule: IProductionRule = new TranslationUnit()){
        this.tokens = new TokenStream(tokens);
        this.tokens.parser = this;
        this.rootRule = rootRule;
        this.program();
    }

    private program() {
        this.ASTRoot = new NonTerminal(null);
        this.rootRule.apply(this.tokens, this.ASTRoot as NonTerminal);
        this.ASTRoot.pruneTail();
        if (this.tokens.currentIndex() < this.tokens.tokens.length - 1){
            let unexpectedToken = this.tokens.tokens[this.tokens.currentIndex() + 1];
            console.error(`parse error: unexpected token ${unexpectedToken.text} at line ${unexpectedToken.line + 1}, column ${unexpectedToken.offset + 1}` );
        }
    }

}

export class TokenStream{

    public mostValidIndex: number = -1;

    public parser: Parser;

    public tokens: Token[];

    private index: number = -1;

    constructor(tokens: Token[]){
        this.tokens = tokens;
    }

    public currentToken(): Token{
        return this.tokens[this.index];
    }

    public nextToken(k: number = 1): Token{
        this.index += k ;
        if (this.index > this.mostValidIndex){
            this.mostValidIndex = this.index;
        }
        return this.tokens[this.index];
    }

    public lookAhead(k: number = 1): Token{
        return this.tokens[this.index + k];
    }

    public setIndex(index: number){
        this.index = index;
        if (this.index > this.mostValidIndex){
            this.mostValidIndex = this.index;
        }
    }

    public currentIndex(): number{
        return this.index;
    }

    public checkFirst(setOrType: Array <TokenType | string> | TokenType | string): boolean{
        if (!this.lookAhead()){
            return false;
        }
        if (setOrType instanceof Array){
            return setOrType.indexOf(this.lookAhead().type) !== -1;
        }
        else {
            return setOrType === this.lookAhead ().type;
        }

    }

    public jumpUntil(s: string | TokenType) {
        let token = this.nextToken();
        while (token && token.type !== s){
            token = this.nextToken();
        }
        return token;
    }
}

export class ASTNode {

    public parent: ASTNode;

    public makeCopy(){
        return null;
    }

    public toObj(){
        return null;
    }

    public get content(){
        return null;
    }
}

export class NonTerminal extends ASTNode {

    public children: ASTNode[] = [];

    public nonTerminal: IProductionRule;

    constructor(nonTerminal: IProductionRule){
        super();
        this.nonTerminal = nonTerminal;
    }

    public addChild(node: ASTNode){

        this.children.push(node);
        node.parent = this;
    }

    public removeChild(node: ASTNode){
        let index = this.children.indexOf(node);
        if (index !== -1){
            this.children.splice(index, 1);
        }
    }

    public findRoot(){
        let node: ASTNode = this;
        while (node.parent){
            node = node.parent;
        }
        return node;

    }

    public getName(){
        if (this.nonTerminal){
            return this.nonTerminal.name;
        }
        else{
            return "root";
        }
    }

    public makeCopy(){
        let copy = new NonTerminal(this.nonTerminal);
        copy.children = this.children.map( (c) => {
            return c.makeCopy();
        });
        copy.children.forEach((c) => {
            c.parent = copy;
        });
        return copy;
    }

    public toObj(){
        return {
            name: this.getName(),
            children: this.children.map((c) => {
                return c.toObj();
            }),
        };
    }

    public findChild(name: string){

        let result = [];
        this.children.forEach((c) => {
            if (c instanceof NonTerminal){
                if (c.getName() === name){
                    result.push(c);
                }
                else {
                    result = result.concat(c.findChild(name));
                }
            }
        });
        return result;

    }

    public get content(){
        return this.children.map((c) => c.content).join(" ");
    }

    public pruneTail(){

        this.children.slice().forEach((c) => {
            if (c instanceof NonTerminal){
              c.pruneTail();
            }
        });
        if (this.getName().indexOf("tail") !== -1){
            let args = ([(this.parent as NonTerminal).children.indexOf(this), 1] as any[]).concat(this.children);
            Array.prototype.splice.apply((this.parent as NonTerminal).children, args);
            this.children.forEach( (c) => {
                c.parent = this.parent;
            });

        }

    }
}

export class Terminal extends ASTNode{

    public token: Token;

    constructor(token: Token){
        super();
        this.token = token;
    }

    public makeCopy(){
        return new Terminal(this.token);
    }

    public toObj(){
        return this.token;
    }

    public get content(){
        return this.token.text;
    }
}

export class ParsingErrorTerminal extends ASTNode{
    public tokens: Token[];

    constructor(tokens: Token[]){
        super();
        this.tokens = tokens;
    }

    public makeCopy(){
        return new ParsingErrorTerminal(this.tokens);
    }

    public toObj(){
        return {
            name: "error",
            tokens: this.tokens,
        };
    }

    public get content(){
        return this.tokens.map( (t) => t.text).join(" ");
    }
}

export function check_rules(rules: Array< IProductionRule | TokenType | string>, tokenStream: TokenStream, nonTerminal: IProductionRule, parent: NonTerminal): ASTNode {

    let result = new NonTerminal(nonTerminal);
    let savedIndex = tokenStream.currentIndex();
    parent.addChild(result);
    for (let rule of rules){
        let node;
        if (typeof rule === "object"){
            node = (rule as IProductionRule).apply(tokenStream, result);
        }
        else {
            if (tokenStream.lookAhead() && tokenStream.lookAhead().type === rule){
                let token = tokenStream.lookAhead();
                node = new Terminal(token);
                result.addChild(node);
                tokenStream.nextToken();
            }
        }

        if (node) {

        }
        else {
            tokenStream.setIndex(savedIndex);
            parent.removeChild(result);
            return null;
        }
    }
    return result;
}
