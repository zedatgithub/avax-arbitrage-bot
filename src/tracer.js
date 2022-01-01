{
	trades: [],
	failed: false,
	step: function(log, db) {
		if (log.op.toNumber() !== 0xA1) {
			return
		}
		var offset = log.stack.peek(0).valueOf()
		var topic0 = log.stack.peek(2)

		if (topic0.toString(16) !== "1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1") {
			return
		}

		this.trades.push({
			pool: toHex(log.contract.getAddress()),
			reserve0: log.stack.peek(6).toString(),
			reserve1: log.stack.peek(5).toString(),
		})
	},
	fault: function(log, db) {
		this.failed = true
	},
	result: function(ctx, db) {
		return {
			trades: this.trades,
			failed: this.failed
		};
	}
}