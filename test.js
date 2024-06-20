function findExpression(nums, target) {
    const operations = ['+', '-', '*', '/'];
    const permutations = [];

    function permute(arr, m = []) {
        if (arr.length === 0) {
            permutations.push(m);
        } else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next));
            }
        }
    }

    function evaluate(expr) {
        try {
            return Function('"use strict";return (' + expr + ')')();
        } catch (e) {
            return null;
        }
    }

    function generateExpressions(nums) {
        if (nums.length === 1) return [nums[0]];

        const results = [];
        for (let i = 0; i < nums.length - 1; i++) {
            const left = nums.slice(0, i + 1);
            const right = nums.slice(i + 1);

            const leftExpressions = generateExpressions(left);
            const rightExpressions = generateExpressions(right);

            for (let leftExpr of leftExpressions) {
                for (let rightExpr of rightExpressions) {
                    for (let op of operations) {
                        results.push(`(${leftExpr})${op}(${rightExpr})`);
                    }
                }
            }
        }
        return results;
    }

    permute(nums);

    for (let perm of permutations) {
        const expressions = generateExpressions(perm.map(String));
        for (let expr of expressions) {
            if (evaluate(expr) === target) {
                return expr;
            }
        }
    }
    
    return null;
}

// コマンドライン引数の処理
const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('Usage: node script.js <target> <num1> <num2> <num3> ...');
    process.exit(1);
}

const target = Number(args[0]);
const input = args.slice(1).map(Number);

const result = findExpression(input, target);

if (result) {
    console.log(`数式: ${result}`);
} else {
    console.log('解が見つかりませんでした。');
}
