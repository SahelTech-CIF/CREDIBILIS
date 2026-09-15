import networkx as nx

def compute_network_score(client_id, connections_list):
    """
    Calcule la centralité du client dans son réseau de tontine / transactions
    sans nécessiter de base de données graphe lourde.
    """
    G = nx.Graph()
    for edge in connections_list:
        G.add_edge(edge[0], edge[1], weight=edge[2])
    
    if client_id not in G:
        return 40.0  # Score réseau par défaut (Cold Start)
    
    pagerank = nx.pagerank(G)
    centrality = pagerank.get(client_id, 0) * 1000
    return min(round(float(centrality), 2), 100.0)